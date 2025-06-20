import React, { useState, useEffect, useRef } from 'react';
import { HARDCODED_CANDIDATE } from '../data/candidateData';
import { ArrowLeft, Circle, Square, Check, Download, Upload, Volume2, Play, Pause, X, Phone } from 'lucide-react';
import VideoFeed from './VideoFeed';
import ProctoredInterviewReport from './ProctoredInterviewReport';
import ElevenLabsWidget from './ElevenLabsWidget';
import ElevenLabsConvai from './ElevenLabsConvai';
import HelpCallButton from './HelpCallButton';
import { ViolationReport } from '../utils/types';
import { uploadMockVideo } from '../utils/mockApi';
import { initFaceDetection, detectFaces } from '../utils/faceDetection';
import { initTabChangeDetection } from '../utils/tabChangeDetection';
import jsPDF from 'jspdf';

interface Level4FlowProps {
  onBack: () => void;
  userName: string;
}

interface ViolationLog {
  id: number;
  type: 'warning' | 'error';
  message: string;
  timestamp: Date;
  details?: string;
}

const Level4Flow: React.FC<Level4FlowProps> = ({ onBack, userName }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [violationLogs, setViolationLogs] = useState<ViolationLog[]>([]);
  const [hasRecording, setHasRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [showReport, setShowReport] = useState(false);
  const [showCustomReport, setShowCustomReport] = useState(false);
  const [showProctoredReport, setShowProctoredReport] = useState(false);
  const [interviewStartTime, setInterviewStartTime] = useState<Date>(new Date());
  const [interviewDuration, setInterviewDuration] = useState<number>(0);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [recordingBlobUrl, setRecordingBlobUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Use hardcoded candidate details instead of dynamic values
  const [userDetails, setUserDetails] = useState({
    fullName: HARDCODED_CANDIDATE.fullName,
    email: HARDCODED_CANDIDATE.email,
    phoneNumber: HARDCODED_CANDIDATE.phoneNumber,
    skills: HARDCODED_CANDIDATE.skills,
    experience: HARDCODED_CANDIDATE.experience
  });
  
  // Load user data from localStorage when component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem('currentUserData');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUserDetails({
          fullName: userData.fullName || userName,
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          skills: userData.skills || "",
          experience: userData.experience || ""
        });
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, [userName]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceDetectionVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const playerRef = useRef<HTMLVideoElement>(null);

  const questions = [
    "Welcome to your proctored interview! This is your final assessment. Let's begin with a professional introduction. Please tell me about yourself and your career aspirations.",
    "Describe a challenging project you've worked on in detail. How did you approach the problem and what was the outcome?",
    "What are your key strengths and how do they align with this role? Provide specific examples from your experience.",
    "How do you handle working under pressure or tight deadlines? Give me a concrete example from your professional experience.",
    "Where do you see yourself in 5 years, and how does this position fit into your career goals?",
    "Do you have any questions about the role or our organization? This concludes your proctored interview."
  ];

  useEffect(() => {
    const startTime = new Date();
    setInterviewStartTime(startTime);
    startTimeRef.current = startTime;
  }, []);

  useEffect(() => {
    // Update interview duration every minute
    if (!showProctoredReport && startTimeRef.current && !isComplete) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const durationInMinutes = Math.floor((now.getTime() - startTimeRef.current.getTime()) / (1000 * 60));
        setInterviewDuration(durationInMinutes);
      }, 60000); // Update every minute
      
      return () => {
        clearInterval(intervalId);
        console.log('Interview duration timer stopped');
      };
    }
  }, [showProctoredReport, isComplete]);

  useEffect(() => {
    if (isVideoOn) {
      const interval = setInterval(() => {
        if (Math.random() > 0.8) {
          const violations = [
            { type: 'error' as const, message: 'Multiple faces detected - interview security breach' },
            { type: 'warning' as const, message: 'Eye tracking: looking away from camera' },
            { type: 'error' as const, message: 'Unauthorized person detected in background' },
            { type: 'warning' as const, message: 'Audio levels inconsistent - possible external interference' },
            { type: 'error' as const, message: 'Screen sharing or recording software detected' },
            { type: 'warning' as const, message: 'Lighting conditions suboptimal for face recognition' }
          ];
          
          const randomViolation = violations[Math.floor(Math.random() * violations.length)];
          const newLog: ViolationLog = {
            id: Date.now(),
            ...randomViolation,
            timestamp: new Date()
          };
          
          setViolationLogs(prev => [newLog, ...prev].slice(0, 15));
        }
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [isVideoOn]);

  useEffect(() => {
    console.log('Level4Flow mounted, initializing face detection...');
    initFaceDetection().catch(error => {
      console.error('Failed to initialize face detection:', error);
    });
  }, []);

  const handleViolation = (violation: { type: 'warning' | 'error'; message: string; timestamp: Date; id: number; details?: string }) => {
    // Only log violations if the interview is not complete
    if (!isComplete) {
      console.log(`Violation detected: ${violation.message}`);
      setViolationLogs(prev => [...prev, violation]);
    }
  };
  
  useEffect(() => {
    console.log('Initializing tab change and keyboard shortcut detection');
    
    const cleanup = initTabChangeDetection({
      onViolation: (type, message) => {
        handleViolation({
          id: Date.now(),
          type: type as 'warning' | 'error',
          message,
          timestamp: new Date()
        });
      },
      detectTabChange: true,
      detectKeyboardShortcuts: true,
      preventDefaultActions: true
    });
    
    return cleanup;
  }, []);

  useEffect(() => {
    if (!isComplete && isRecording) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          setIsComplete(true);
          stopRecording();
        }
      }, 45000);

      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, isComplete, isRecording]);

  const handleVideoStatusChange = (status: boolean) => {
    setIsVideoOn(status);
    if (status && videoRef.current) {
      streamRef.current = videoRef.current.srcObject as MediaStream;
      console.log('Video stream captured for recording');
    }
  };

  const startRecording = async () => {
    if (!isVideoOn) {
      console.error('Video must be enabled to start recording');
      alert('Please enable your camera before recording');
      return;
    }

    try {
      let combinedStream;
      
      if (streamRef.current) {
        const videoTracks = streamRef.current.getVideoTracks();
        
        if (videoTracks.length === 0) {
          console.error('No video tracks available in the current stream');
          alert('Camera not properly initialized. Please refresh and try again.');
          return;
        }
        
        let audioStream;
        try {
          audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setIsMicOn(true);
        } catch (audioError) {
          console.warn('Could not get audio stream:', audioError);
          alert('Could not access microphone. Recording will proceed without audio.');
        }
        
        const tracks = [...videoTracks];
        if (audioStream) {
          tracks.push(...audioStream.getAudioTracks());
        }
        
        combinedStream = new MediaStream(tracks);
      } else {
        combinedStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        streamRef.current = combinedStream;
        setIsVideoOn(true);
        setIsMicOn(true);
      }

      console.log('Combined stream created with tracks:', combinedStream.getTracks().map(t => t.kind));
      
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      setRecordedChunks([]);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
          console.log('Recorded chunk size:', event.data.size);
        }
      };

      mediaRecorder.onstop = () => {
        setHasRecording(true);
        console.log('Recording stopped, total chunks:', recordedChunks.length);
        
        setTimeout(async () => {
          console.log('Preparing to upload recording, chunks:', recordedChunks.length);
          
          if (recordedChunks.length > 0) {
            try {
              setIsUploading(true);
              setUploadSuccess(false);
              
              const blob = new Blob(recordedChunks, { type: 'video/webm' });
              console.log('Blob size for upload:', blob.size, 'bytes');
              
              if (blob.size === 0) {
                console.error('Recording is empty');
                setIsUploading(false);
                return;
              }
              
              const fileName = `proctored-interview-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.webm`;
              
              console.log('Automatically uploading recording to S3:', fileName);
              const downloadUrl = await uploadMockVideo(blob, fileName);
              
              setUploadUrl(downloadUrl);
              setUploadSuccess(true);
              setIsUploading(false);
              
              const url = URL.createObjectURL(blob);
              setRecordingBlobUrl(url);
              setShowVideoPlayer(true);
              
              console.log('Automatic upload successful, download URL:', downloadUrl);
              alert('Your proctored interview recording has been successfully uploaded to S3 and is available for viewing.');
            } catch (error) {
              console.error('Error during automatic upload to S3:', error);
              alert('There was an error uploading your recording to S3: ' + error.message);
              setIsUploading(false);
            }
          }
        }, 1500);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      console.log('Proctored interview recording started successfully');
      
      setCurrentQuestionIndex(0);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording: ' + error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        console.log('Stopping proctored interview recording');
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            if (track.kind === 'audio') {
              track.stop();
            }
          });
        }
        
        // Don't show alert when ending interview for report generation
        if (!isComplete) {
          alert('Proctored interview recording has been stopped. Video player will open automatically.');
        }
        
        // Save the final interview state for the report
        const endTime = new Date();
        if (startTimeRef.current) {
          const finalDuration = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60));
          setInterviewDuration(finalDuration);
        }
        
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  // Function to stop all camera streams and resources
  const stopAllCameraStreams = () => {
    console.log('Stopping all camera streams and resources...');
    
    // Stop all video tracks from streamRef
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track from streamRef`);
      });
      // Clear the streamRef
      streamRef.current = null;
    }
    
    // Stop any video tracks from videoRef
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track from videoRef`);
      });
      // Clear the video source
      videoRef.current.srcObject = null;
    }
    
    // Stop any video tracks from faceDetectionVideoRef
    if (faceDetectionVideoRef.current && faceDetectionVideoRef.current.srcObject instanceof MediaStream) {
      const stream = faceDetectionVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track from faceDetectionVideoRef`);
      });
      // Clear the video source
      faceDetectionVideoRef.current.srcObject = null;
    }
    
    // Set video state to off
    setIsVideoOn(false);
    
    // Clear any animation frames that might be running
    if (window.requestAnimationFrame) {
      // Cancel all possible animation frame IDs (a bit brute force but effective)
      for (let i = 0; i < 1000; i++) {
        window.cancelAnimationFrame(i);
      }
    }
    
    // Force garbage collection of any tensors that might be in use
    try {
      // Access TensorFlow through the global namespace in a type-safe way
      const tfjs = (window as any).tf;
      if (tfjs && typeof tfjs.dispose === 'function') {
        tfjs.dispose();
        console.log('TensorFlow resources disposed');
      }
    } catch (e) {
      console.log('Error disposing TensorFlow resources:', e);
    }
    
    console.log('All camera streams and resources stopped');
  };
  
  const handleEndInterview = () => {
    console.log('Ending proctored interview and generating comprehensive report...');
    
    // Mark the interview as complete first to stop all ongoing processes
    setIsComplete(true);
    
    // Calculate final interview duration
    if (startTimeRef.current) {
      const endTime = new Date();
      const finalDuration = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60));
      setInterviewDuration(finalDuration);
    }
    
    // Stop recording if it's active
    if (isRecording) {
      stopRecording();
    }
    
    // Stop all camera streams and resources
    stopAllCameraStreams();
    
    // Finalize violation logs (prevent any new logs from being added)
    const finalViolationLogs = [...violationLogs];
    
    // Calculate final score before showing report
    const calculateFinalScore = () => {
      // Base score calculation logic
      const baseScore = 100;
      const violationPenalties = {
        warning: 5,
        error: 10
      };
      
      // Count violations by type
      const warningCount = finalViolationLogs.filter(log => log.type === 'warning').length;
      const errorCount = finalViolationLogs.filter(log => log.type === 'error').length;
      
      // Calculate penalty
      const totalPenalty = (warningCount * violationPenalties.warning) + (errorCount * violationPenalties.error);
      
      // Ensure score doesn't go below 0
      return Math.max(0, baseScore - totalPenalty);
    };
    
    // Force stop any ongoing timers or intervals
    for (let i = 0; i < 1000; i++) {
      window.clearInterval(i);
      window.clearTimeout(i);
    }
    
    // Set a small delay to ensure recording is properly stopped before showing the report
    setTimeout(() => {
      // Show the proctored report
      setShowProctoredReport(true);
      
      console.log('Interview completed. Report generated successfully.');
    }, 1000);
  };

  const handleBackFromReport = () => {
    setShowProctoredReport(false);
    onBack();
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) {
      console.error('No recording available');
      alert('No recording available to download');
      return;
    }

    try {
      console.log('Creating blob from', recordedChunks.length, 'chunks');
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      console.log('Blob size:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        alert('Recording is empty. Please try recording again.');
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proctored-interview-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Download initiated');
    } catch (error) {
      console.error('Error downloading recording:', error);
      alert('Error downloading recording: ' + error.message);
    }
  };

  const downloadRecordingFromBlob = () => {
    if (!recordingBlobUrl) {
      console.error('No recording blob URL available');
      alert('No recording available to download');
      return;
    }

    try {
      const a = document.createElement('a');
      a.href = recordingBlobUrl;
      a.download = `proctored-interview-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      console.log('Download initiated from blob URL');
    } catch (error) {
      console.error('Error downloading recording from blob:', error);
      alert('Error downloading recording: ' + error.message);
    }
  };

  const uploadRecordingToS3 = async () => {
    if (recordedChunks.length === 0) {
      console.error('No recording available');
      alert('No recording available to upload');
      return;
    }

    try {
      setIsUploading(true);
      setUploadSuccess(false);
      
      console.log('Creating blob for S3 upload from', recordedChunks.length, 'chunks');
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      console.log('Blob size for upload:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        alert('Recording is empty. Please try recording again.');
        setIsUploading(false);
        return;
      }
      
      const fileName = `proctored-interview-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.webm`;
      
      console.log('Uploading recording to S3:', fileName);
      const downloadUrl = await uploadMockVideo(blob, fileName);
      
      setUploadUrl(downloadUrl);
      setUploadSuccess(true);
      setIsUploading(false);
      
      console.log('Upload successful, download URL:', downloadUrl);
      alert('Recording has been successfully uploaded to S3. It can be accessed using the provided link.');
    } catch (error) {
      console.error('Error uploading recording to S3:', error);
      alert('Error uploading recording: ' + error.message);
      setIsUploading(false);
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    if (recordingBlobUrl) {
      URL.revokeObjectURL(recordingBlobUrl);
      setRecordingBlobUrl('');
    }
    setIsPlaying(false);
  };

  // Effect to handle cleanup when showing the report
  useEffect(() => {
    if (showProctoredReport) {
      // This ensures all resources are cleaned up when showing the report
      stopAllCameraStreams();
      
      // Force clear any intervals that might be running
      const intervalIds = [];
      for (let i = 0; i < 1000; i++) {
        intervalIds.push(window.clearInterval(i));
      }
      
      console.log('All processes stopped for report view');
      
      return () => {
        // Cleanup when unmounting
        intervalIds.forEach(id => window.clearInterval(id));
      };
    }
  }, [showProctoredReport]);
  
  // Show proctored interview report
  if (showProctoredReport) {
    return (
      <ProctoredInterviewReport
        candidateDetails={{
          fullName: userDetails.fullName,
          email: userDetails.email,
          phoneNumber: userDetails.phoneNumber,
          skills: userDetails.skills,
          experience: userDetails.experience
        }}
        violationLogs={violationLogs}
        onBack={handleBackFromReport}
        duration={interviewDuration}
        interviewStartTime={interviewStartTime}
        totalQuestions={questions.length}
        answeredQuestions={currentQuestionIndex + 1}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f7fe] relative">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Level 4 - Self Practice</h1>
                <p className="text-sm text-gray-600">AI-Monitored Practice Session</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Duration</div>
                <div className="text-lg font-semibold text-gray-900">{interviewDuration} min</div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600">Question</div>
                <div className="text-lg font-semibold text-gray-900">{currentQuestionIndex + 1} of {questions.length}</div>
              </div>
              
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-lg ${audioEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                title={audioEnabled ? 'Disable voice' : 'Enable voice'}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Video Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Camera Feed */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <VideoFeed
                  onStatusChange={handleVideoStatusChange}
                  onViolation={handleViolation}
                />
              </div>

              <div className="bg-[#f1f7fe]/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recording Controls</h3>
                  <div className="flex items-center space-x-2">
                    {isRecording && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <Circle className="w-3 h-3 fill-current animate-pulse" />
                        <span className="text-sm font-medium">Recording</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!isVideoOn}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4" />
                        <span>Stop Recording</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Start Recording</span>
                      </>
                    )}
                  </button>

                  {hasRecording && (
                    <>
                      <button
                        onClick={downloadRecording}
                        className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>

                    
                    </>
                  )}
                </div>

                {uploadSuccess && uploadUrl && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">Upload successful! Access your recording:</p>
                    <a 
                      href={uploadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {uploadUrl}
                    </a>
                  </div>
                )}
              </div>

              {showVideoPlayer && recordingBlobUrl && (
                <div className="bg-[#f1f7fe]/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recording Playback</h3>
                    <button
                      onClick={closeVideoPlayer}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <video
                      ref={playerRef}
                      src={recordingBlobUrl}
                      className="w-full rounded-lg"
                      controls
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                    
                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        onClick={togglePlayPause}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Play</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={downloadRecordingFromBlob}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#f1f7fe]/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Current Question</h3>
                  <div className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-4">
                  <p className="text-gray-800 leading-relaxed">{questions[currentQuestionIndex]}</p>
                </div>
                
                {/* ElevenLabs Convai widget moved to right column below violation logs */}
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {currentQuestionIndex === questions.length - 1 ? (
                    <button
                      onClick={handleEndInterview}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
                    >
                      <span>End Interview & Generate Report</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - AI Assistant and Violation Logs */}
            <div className="space-y-6">
              {/* Violation Monitoring Section - Now at the top */}
              <div className="bg-[#f1f7fe]/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Violation Monitoring</h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {violationLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-gray-600">No violations detected</p>
                      <p className="text-sm text-gray-500 mt-1">Keep up the good work!</p>
                    </div>
                  ) : (
                    violationLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          log.type === 'error'
                            ? 'bg-red-50 border-red-400 text-red-800'
                            : 'bg-yellow-50 border-yellow-400 text-yellow-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{log.message}</p>
                            <p className="text-xs opacity-75 mt-1">
                              {log.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              log.type === 'error'
                                ? 'bg-red-200 text-red-800'
                                : 'bg-yellow-200 text-yellow-800'
                            }`}
                          >
                            {log.type.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Help section removed as requested */}

              {/* Add ElevenLabs widget here */}
              {audioEnabled && (
                <div className="mt-4 bg-[#f1f7fe] rounded-xl p-4 border border-blue-200/30"> 
                  <ElevenLabsWidget text={questions[currentQuestionIndex]} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level4Flow;
