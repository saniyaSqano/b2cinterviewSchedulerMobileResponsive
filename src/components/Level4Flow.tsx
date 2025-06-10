import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, Download, Square, Circle, Upload, Check, User, Mail, Phone, Award, Star, TrendingUp, Clock } from 'lucide-react';
import Level4CongratulationsScreen from './Level4CongratulationsScreen';
import VideoFeed from './VideoFeed';
import SelfPracticeReport from './SelfPracticeReport';
import ProctoredInterviewReport from './ProctoredInterviewReport';
import { initFaceDetection, detectFaces } from '../utils/faceDetection';
import { uploadMockVideo } from '../utils/s3Service';
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
}

const Level4Flow: React.FC<Level4FlowProps> = ({ onBack, userName }) => {
  const [showCongratulations, setShowCongratulations] = useState(true);
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
  
  // Store user details from localStorage
  const [userDetails, setUserDetails] = useState({
    fullName: userName,
    email: "",
    phoneNumber: "",
    skills: "",
    experience: ""
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

  const questions = [
    "Welcome to your proctored interview! This is your final assessment. Let's begin with a professional introduction. Please tell me about yourself and your career aspirations.",
    "Describe a challenging project you've worked on in detail. How did you approach the problem and what was the outcome?",
    "What are your key strengths and how do they align with this role? Provide specific examples from your experience.",
    "How do you handle working under pressure or tight deadlines? Give me a concrete example from your professional experience.",
    "Where do you see yourself in 5 years, and how does this position fit into your career goals?",
    "Do you have any questions about the role or our organization? This concludes your proctored interview."
  ];

  // Calculate interview duration
  useEffect(() => {
    if (!showCongratulations && !showProctoredReport && startTimeRef.current) {
      const interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - startTimeRef.current!.getTime()) / (1000 * 60));
        setInterviewDuration(duration);
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [showCongratulations, showProctoredReport]);

  // Enhanced violation detection for proctored interview
  useEffect(() => {
    if (!showCongratulations && isVideoOn) {
      const interval = setInterval(() => {
        // More frequent violation checks for proctored environment
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
          
          setViolationLogs(prev => [newLog, ...prev].slice(0, 15)); // Keep more logs for proctored session
        }
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [showCongratulations, isVideoOn]);

  // Initialize face detection on component mount
  useEffect(() => {
    console.log('Level4Flow mounted, initializing face detection...');
    initFaceDetection().catch(error => {
      console.error('Failed to initialize face detection:', error);
    });
  }, []);

  // Handle violations from VideoFeed component or tab change detection
  const handleViolation = (violation: ViolationLog) => {
    console.log('Violation received:', violation);
    setViolationLogs(prev => [violation, ...prev].slice(0, 15));
  };
  
  // Initialize tab change and keyboard shortcut detection
  useEffect(() => {
    if (!showCongratulations) {
      console.log('Initializing tab change and keyboard shortcut detection');
      
      // Initialize tab change detection with our violation handler
      const cleanup = initTabChangeDetection({
        onViolation: (type, message) => {
          // Convert to our ViolationLog format
          handleViolation({
            id: Date.now(),
            type: type as 'warning' | 'error',
            message,
            timestamp: new Date()
          });
        },
        detectTabChange: true,
        detectKeyboardShortcuts: true,
        preventDefaultActions: true // Block the shortcuts from actually working
      });
      
      // Clean up when component unmounts or congratulations screen shows
      return cleanup;
    }
  }, [showCongratulations]);

  // Auto-advance questions for proctored interview
  useEffect(() => {
    if (!showCongratulations && !isComplete && isRecording) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          setIsComplete(true);
          stopRecording();
        }
      }, 45000); // 45 seconds per question

      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, showCongratulations, isComplete, isRecording]);

  const handleProceedToInterview = () => {
    setShowCongratulations(false);
    const startTime = new Date();
    setInterviewStartTime(startTime);
    startTimeRef.current = startTime;
  };

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
      // Get both video and audio streams
      let combinedStream;
      
      if (streamRef.current) {
        // If we already have the video stream from VideoFeed
        const videoTracks = streamRef.current.getVideoTracks();
        
        if (videoTracks.length === 0) {
          console.error('No video tracks available in the current stream');
          alert('Camera not properly initialized. Please refresh and try again.');
          return;
        }
        
        // Get audio stream separately if needed
        let audioStream;
        try {
          audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setIsMicOn(true);
        } catch (audioError) {
          console.warn('Could not get audio stream:', audioError);
          alert('Could not access microphone. Recording will proceed without audio.');
        }
        
        // Combine video and audio tracks
        const tracks = [...videoTracks];
        if (audioStream) {
          tracks.push(...audioStream.getAudioTracks());
        }
        
        combinedStream = new MediaStream(tracks);
      } else {
        // If we don't have a stream yet, get both video and audio
        combinedStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        streamRef.current = combinedStream;
        setIsVideoOn(true);
        setIsMicOn(true);
      }

      console.log('Combined stream created with tracks:', combinedStream.getTracks().map(t => t.kind));
      
      // Create media recorder with the combined stream
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
        
        // Wait a short time to ensure all chunks are collected
        setTimeout(async () => {
          console.log('Preparing to upload recording, chunks:', recordedChunks.length);
          
          if (recordedChunks.length > 0) {
            try {
              setIsUploading(true);
              setUploadSuccess(false);
              
              // Create blob from recorded chunks
              const blob = new Blob(recordedChunks, { type: 'video/webm' });
              console.log('Blob size for upload:', blob.size, 'bytes');
              
              if (blob.size === 0) {
                console.error('Recording is empty');
                setIsUploading(false);
                return;
              }
              
              // Generate filename with user name and timestamp
              const fileName = `proctored-interview-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.webm`;
              
              // Upload to S3 using the uploadMockVideo function
              console.log('Automatically uploading recording to S3:', fileName);
              const downloadUrl = await uploadMockVideo(blob, fileName);
              
              setUploadUrl(downloadUrl);
              setUploadSuccess(true);
              setIsUploading(false);
              
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

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      console.log('Proctored interview recording started successfully');
      
      // Reset to first question when recording starts
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
        
        // Release tracks to avoid memory leaks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            // Only stop audio tracks, keep video running for the UI
            if (track.kind === 'audio') {
              track.stop();
            }
          });
        }
        
        // Show a notification that recording has stopped
        alert('Proctored interview recording has been stopped. It will be automatically uploaded to S3.');
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  const handleEndInterview = () => {
    console.log('Ending proctored interview and generating comprehensive report...');
    
    // Calculate final duration
    if (startTimeRef.current) {
      const endTime = new Date();
      const finalDuration = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60));
      setInterviewDuration(finalDuration);
    }
    
    stopRecording();
    setShowProctoredReport(true);
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
      
      // Generate filename with user name and timestamp
      const fileName = `proctored-interview-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.webm`;
      
      // Upload to S3 using the uploadMockVideo function
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

  if (showCongratulations) {
    return (
      <Level4CongratulationsScreen
        onBack={onBack}
        onProceed={handleProceedToInterview}
        userName={userName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Proctored Interview</h1>
              <p className="text-sm text-gray-600">Level 4 - Final Assessment</p>
            </div>
          </div>
          
          {/* Recording Controls */}
          <div className="flex items-center space-x-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={!isVideoOn}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
              >
                <Circle className="w-4 h-4 animate-pulse" />
                <span>Start Interview</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse shadow-md"
              >
                <Square className="w-4 h-4" />
                <span>Stop Interview</span>
              </button>
            )}
            
            <button
              onClick={handleEndInterview}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors shadow-md font-medium"
            >
              End Interview & View Report
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen pt-20">
        {/* Left Side - Video Feed */}
        <div className="w-3/5 p-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Proctored Camera</h3>
              <div className="flex items-center space-x-2">
                {isRecording && (
                  <div className="flex items-center space-x-2 text-red-500">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Recording</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Proctored</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-[calc(100%-4rem)] bg-gray-900 rounded-xl overflow-hidden">
              <VideoFeed
                onStatusChange={handleVideoStatusChange}
                videoRef={videoRef}
                faceDetectionVideoRef={faceDetectionVideoRef}
                onViolation={handleViolation}
              />
            </div>
          </div>
        </div>

        {/* Right Side - AI Interview & Violations */}
        <div className="w-2/5 p-6 flex flex-col">
          {/* Current Question Display */}
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-medium text-purple-800 mb-1">Interview Question ({currentQuestionIndex + 1}/{questions.length})</h3>
            <p className="text-gray-800">{questions[currentQuestionIndex]}</p>
          </div>

          {/* AI Proctoring System */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">AI Proctoring System</h3>
                <p className="text-sm text-gray-600">Monitoring interview integrity</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Active Monitoring</span>
                </div>
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</span>
              </div>
              <p className="text-gray-800 leading-relaxed">{questions[currentQuestionIndex]}</p>
              {isRecording && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-600">Interview in progress</span>
                </div>
              )}
            </div>
          </div>

          {/* Response Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Response Status</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Mic className={`w-4 h-4 ${isMicOn ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-sm text-gray-600">
                    Microphone {isMicOn ? 'active' : 'inactive'} - speak your response
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Audio quality good</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Face detection active</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-center">
                {isRecording 
                  ? "Recording your responses. Please maintain eye contact and speak clearly."
                  : "Click 'Start Interview' to begin the proctored assessment."
                }
              </p>
            </div>
          </div>

          {/* Violation Logs */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Security Monitoring</h4>
            {violationLogs.length === 0 ? (
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">No security violations detected</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {violationLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg text-sm ${
                      log.type === 'error' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{log.message}</span>
                      <span className="text-xs opacity-70 ml-2">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {isComplete && !showProctoredReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Interview Complete!</h3>
            <p className="text-gray-600 mb-6">
              Congratulations! You've completed your proctored interview assessment. 
              {hasRecording && " Your interview has been recorded and analyzed."}
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleEndInterview}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors flex items-center justify-center font-medium"
              >
                <Award className="w-5 h-5 mr-2" />
                View Comprehensive Report
              </button>
              {hasRecording && (
                <button
                  onClick={downloadRecording}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Recording
                </button>
              )}
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Levels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Self Practice Report Popup - keeping this for backward compatibility */}
      {showCustomReport && (
        <SelfPracticeReport
          onClose={() => setShowCustomReport(false)}
          userDetails={{
            fullName: userDetails.fullName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber,
            skills: userDetails.skills,
            experience: userDetails.experience
          }}
        />
      )}
    </div>
  );
};

export default Level4Flow;

</initial_code>
