
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import Level4CongratulationsScreen from './Level4CongratulationsScreen';

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

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

const Level4Flow: React.FC<Level4FlowProps> = ({ onBack, userName }) => {
  const [showCongratulations, setShowCongratulations] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [violationLogs, setViolationLogs] = useState<ViolationLog[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const practiceQuestions = [
    "Welcome to your self-practice session! Let's start with a warm-up. Tell me about yourself and what brings you here today.",
    "Great! Now, describe a challenging situation you've faced and how you overcame it.",
    "What are your greatest strengths and how do they help you in professional settings?",
    "Where do you see yourself in the next 5 years?",
    "What questions do you have for me about this role or our company?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      console.log('Cleaning up camera stream...');
      stopCamera();
    };
  }, []);

  // Simulate violation detection
  useEffect(() => {
    if (!showCongratulations && isVideoOn) {
      const interval = setInterval(() => {
        // Randomly add violation logs for demonstration
        if (Math.random() > 0.85) {
          const violations = [
            { type: 'warning' as const, message: 'Multiple faces detected in frame' },
            { type: 'warning' as const, message: 'Looking away from camera detected' },
            { type: 'error' as const, message: 'Unauthorized person in background' },
            { type: 'warning' as const, message: 'Audio levels inconsistent' }
          ];
          
          const randomViolation = violations[Math.floor(Math.random() * violations.length)];
          const newLog: ViolationLog = {
            id: Date.now(),
            ...randomViolation,
            timestamp: new Date()
          };
          
          setViolationLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep only last 10 logs
        }
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [showCongratulations, isVideoOn]);

  const startCamera = async () => {
    try {
      setIsStartingCamera(true);
      setCameraError(null);
      console.log('Attempting to start camera...');
      
      stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: false 
      });
      
      console.log('Got camera stream:', stream);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsVideoOn(true);
        setIsStartingCamera(false);
        console.log('Camera started successfully');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please check your permissions and try again.');
      setIsVideoOn(false);
      setIsStartingCamera(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsVideoOn(false);
  };

  const toggleVideo = () => {
    console.log('Toggle video clicked, current state:', isVideoOn);
    if (isVideoOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleProceedToPractice = async () => {
    console.log('Proceeding to practice session...');
    setShowCongratulations(false);
    
    setTimeout(async () => {
      console.log('Starting camera for practice...');
      await startCamera();
      
      setTimeout(() => {
        const firstQuestion: Message = {
          id: Date.now(),
          text: practiceQuestions[0],
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages([firstQuestion]);
      }, 1000);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');

    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setTimeout(() => {
        const nextQuestionIndex = currentQuestionIndex + 1;
        const nextQuestion: Message = {
          id: Date.now() + 1,
          text: practiceQuestions[nextQuestionIndex],
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextQuestion]);
        setCurrentQuestionIndex(nextQuestionIndex);
      }, 1500);
    } else {
      setTimeout(() => {
        const completionMessage: Message = {
          id: Date.now() + 1,
          text: "Excellent work! You've completed your self-practice session. Your responses show great preparation and confidence. You're ready for the proctored interview!",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, completionMessage]);
        setIsComplete(true);
      }, 1500);
    }
  };

  if (showCongratulations) {
    return (
      <Level4CongratulationsScreen
        onBack={onBack}
        onProceed={handleProceedToPractice}
        userName={userName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <div className="relative z-10 h-screen flex">
        {/* Left Side - Video Feed and Violations (60%) */}
        <div className="w-3/5 bg-gradient-to-br from-indigo-100/80 to-blue-100/80 backdrop-blur-md border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                Level 4 - Self Practice
              </h2>
            </div>
          </div>

          {/* Video Feed */}
          <div className="flex-1 p-4">
            <div className="bg-white/90 rounded-2xl p-4 h-3/5 flex flex-col mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Video</h3>
              <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden relative">
                {isStartingCamera ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-white text-lg">Starting camera...</p>
                  </div>
                ) : cameraError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                    <VideoOff className="w-16 h-16 text-red-400 mb-4" />
                    <p className="text-red-400 text-lg mb-4">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="mt-4 px-6 py-3 bg-indigo-500 text-white text-lg rounded-full hover:bg-indigo-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : isVideoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                    <VideoOff className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-400 text-lg mb-4">Camera is off</p>
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 bg-indigo-500 text-white text-lg rounded-full hover:bg-indigo-600 transition-colors"
                    >
                      Start Camera
                    </button>
                  </div>
                )}
              </div>
              
              {/* Video Controls */}
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={toggleVideo}
                  disabled={isStartingCamera}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOn 
                      ? 'bg-gray-200 hover:bg-gray-300' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  } ${isStartingCamera ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-full transition-colors ${
                    isMicOn 
                      ? 'bg-gray-200 hover:bg-gray-300' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Violation Logs */}
            <div className="bg-white/90 rounded-2xl p-4 h-2/5">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-700">Violation Logs</h3>
              </div>
              <div className="h-32 overflow-y-auto space-y-2">
                {violationLogs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-green-600">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    <span className="text-sm font-medium">No violations detected</span>
                  </div>
                ) : (
                  violationLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start space-x-2 p-2 rounded-lg ${
                        log.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                        log.type === 'error' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-xs font-medium ${
                          log.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          {log.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - AI Interview Coach (40%) */}
        <div className="w-2/5 flex flex-col">
          {/* AI Coach Header */}
          <div className="bg-gradient-to-r from-indigo-100/80 to-blue-100/80 backdrop-blur-md p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-2xl">🤖</div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  AI Practice Coach
                </h3>
                <p className="text-xs text-gray-600">Your practice interview companion</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white'
                      : 'bg-white/90 backdrop-blur-md text-gray-800 shadow-lg'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <div className="text-base">🤖</div>
                    )}
                    <div>
                      <p className="leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!isComplete && (
            <div className="bg-white/90 backdrop-blur-md border-t border-white/20 p-3">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your response here..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    rows={2}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim()}
                  className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* Completion Area */}
          {isComplete && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 p-3">
              <div className="text-center">
                <p className="text-green-800 font-semibold mb-2 text-sm">Level 4 Complete! 🎉</p>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg text-sm"
                >
                  Continue to Next Level
                </button>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full px-2 py-1 shadow-lg">
            <p className="text-xs font-medium text-gray-700">
              Question {Math.min(currentQuestionIndex + 1, practiceQuestions.length)} of {practiceQuestions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level4Flow;
