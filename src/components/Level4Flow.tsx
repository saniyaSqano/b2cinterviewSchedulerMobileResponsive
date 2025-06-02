
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, Download, Square, Circle } from 'lucide-react';
import Level4CongratulationsScreen from './Level4CongratulationsScreen';
import VideoFeed from './VideoFeed';
import { initFaceDetection, detectFaces } from '../utils/faceDetection';

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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceDetectionVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const questions = [
    "Welcome to your self-practice session! Let's start with a warm-up. Tell me about yourself and what brings you here today.",
    "Describe a challenging situation you faced in your previous role and how you handled it.",
    "What are your greatest strengths and how do they apply to this position?",
    "Where do you see yourself in 5 years and how does this role fit into your career goals?",
    "Do you have any questions about the role or our company?"
  ];

  // Initialize face detection on component mount
  useEffect(() => {
    console.log('Level4Flow mounted, initializing face detection...');
    initFaceDetection().catch(error => {
      console.error('Failed to initialize face detection:', error);
    });
  }, []);

  // Face detection and violation monitoring
  useEffect(() => {
    if (!showCongratulations && isVideoOn && faceDetectionVideoRef.current) {
      const interval = setInterval(async () => {
        try {
          const results = await detectFaces(faceDetectionVideoRef.current!);
          
          if (results.noFaceDetected) {
            const newLog: ViolationLog = {
              id: Date.now(),
              type: 'warning',
              message: 'No face detected - please ensure you are visible',
              timestamp: new Date()
            };
            setViolationLogs(prev => [newLog, ...prev].slice(0, 10));
          } else if (results.multipleFacesDetected) {
            const newLog: ViolationLog = {
              id: Date.now(),
              type: 'error',
              message: 'Multiple faces detected - ensure only you are in frame',
              timestamp: new Date()
            };
            setViolationLogs(prev => [newLog, ...prev].slice(0, 10));
          }
        } catch (error) {
          console.error('Face detection error:', error);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [showCongratulations, isVideoOn]);

  // Auto-advance questions
  useEffect(() => {
    if (!showCongratulations && !isComplete) {
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
  }, [currentQuestionIndex, showCongratulations, isComplete]);

  const handleProceedToInterview = () => {
    setShowCongratulations(false);
  };

  const handleVideoStatusChange = (status: boolean) => {
    setIsVideoOn(status);
    if (status && videoRef.current) {
      streamRef.current = videoRef.current.srcObject as MediaStream;
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      console.error('No stream available for recording');
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      setRecordedChunks([]);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        setHasRecording(true);
        console.log('Recording stopped');
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Stopping recording');
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) {
      console.error('No recording available');
      return;
    }

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-recording-${new Date().toISOString().split('T')[0]}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
              <h1 className="text-2xl font-bold text-gray-800">Self-Practice Interview</h1>
              <p className="text-sm text-gray-600">Level 4 - Practice Session</p>
            </div>
          </div>
          
          {/* Recording Controls */}
          <div className="flex items-center space-x-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={!isVideoOn}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Circle className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse"
              >
                <Square className="w-4 h-4" />
                <span>Stop Recording</span>
              </button>
            )}
            
            {hasRecording && (
              <button
                onClick={downloadRecording}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
            
            <button
              onClick={onBack}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen pt-20">
        {/* Left Side - Video Feed */}
        <div className="w-1/2 p-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Your Video</h3>
              <div className="flex items-center space-x-2">
                {isRecording && (
                  <div className="flex items-center space-x-2 text-red-500">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Recording</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative h-[calc(100%-4rem)] bg-gray-900 rounded-xl overflow-hidden">
              <VideoFeed
                onStatusChange={handleVideoStatusChange}
                videoRef={videoRef}
                faceDetectionVideoRef={faceDetectionVideoRef}
              />
            </div>
          </div>
        </div>

        {/* Right Side - AI Interview */}
        <div className="w-1/2 p-6 flex flex-col">
          {/* AI Practice Coach */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">AI Practice Coach</h3>
                <p className="text-sm text-gray-600">Your interview companion</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Online</span>
                </div>
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-sm text-gray-500">11:40</span>
              </div>
              <p className="text-gray-800 leading-relaxed">{questions[currentQuestionIndex]}</p>
              {!isVideoOn && (
                <p className="text-red-500 text-sm mt-2">Failed to play speech</p>
              )}
            </div>
          </div>

          {/* Response Area */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Response</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Microphone active - speak your response</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Good audio</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <span className="text-sm">No USB storage devices</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-center">Your responses will appear here after you answer the question.</p>
            </div>
          </div>

          {/* Violation Logs */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Violation Logs</h4>
            {violationLogs.length === 0 ? (
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">No violations detected</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {violationLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2 rounded-lg text-sm ${
                      log.type === 'error' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span>{log.message}</span>
                      <span className="text-xs opacity-70">
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
      {isComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Practice Complete!</h3>
            <p className="text-gray-600 mb-6">
              Great job! You've completed your self-practice session. 
              {hasRecording && " Your interview has been recorded and is ready for download."}
            </p>
            <div className="flex space-x-3">
              {hasRecording && (
                <button
                  onClick={downloadRecording}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Download Recording
                </button>
              )}
              <button
                onClick={onBack}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Level4Flow;
