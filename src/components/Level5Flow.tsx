
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import Level5CongratulationsScreen from './Level5CongratulationsScreen';

interface Level5FlowProps {
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

const Level5Flow: React.FC<Level5FlowProps> = ({ onBack, userName }) => {
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

  const interviewQuestions = [
    "Welcome to your AI Proctored Interview! This is your final assessment. Let's begin with a professional introduction. Please tell me about yourself and your career aspirations.",
    "Describe a challenging project you've worked on. How did you approach the problem and what was the outcome?",
    "What are your key strengths and how do they align with this role? Provide specific examples.",
    "How do you handle working under pressure or tight deadlines? Give me a concrete example.",
    "Where do you see yourself in 5 years, and how does this position fit into your career goals?",
    "Do you have any questions about the role or our organization?"
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

  const startCamera = async () => {
    try {
      setIsStartingCamera(true);
      setCameraError(null);
      console.log('Starting proctored interview camera...');
      
      stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: true 
      });
      
      console.log('Got proctored camera stream:', stream);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsVideoOn(true);
        setIsStartingCamera(false);
        console.log('Proctored camera started successfully');
      }
    } catch (error) {
      console.error('Error accessing proctored camera:', error);
      setCameraError('Unable to access camera. Camera access is required for the proctored interview.');
      setIsVideoOn(false);
      setIsStartingCamera(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping proctored camera...');
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
    console.log('Toggle proctored video clicked, current state:', isVideoOn);
    if (isVideoOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleProceedToInterview = async () => {
    console.log('Proceeding to proctored interview...');
    setShowCongratulations(false);
    
    setTimeout(async () => {
      console.log('Starting camera for proctored interview...');
      await startCamera();
      
      setTimeout(() => {
        const firstQuestion: Message = {
          id: Date.now(),
          text: interviewQuestions[0],
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

    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setTimeout(() => {
        const nextQuestionIndex = currentQuestionIndex + 1;
        const nextQuestion: Message = {
          id: Date.now() + 1,
          text: interviewQuestions[nextQuestionIndex],
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextQuestion]);
        setCurrentQuestionIndex(nextQuestionIndex);
      }, 2000);
    } else {
      setTimeout(() => {
        const completionMessage: Message = {
          id: Date.now() + 1,
          text: "Congratulations! You have successfully completed your AI Proctored Interview. Your responses demonstrated excellent preparation, professionalism, and strong communication skills. You have successfully finished all levels of our comprehensive interview preparation program!",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, completionMessage]);
        setIsComplete(true);
      }, 2000);
    }
  };

  if (showCongratulations) {
    return (
      <Level5CongratulationsScreen
        onBack={onBack}
        onProceed={handleProceedToInterview}
        userName={userName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 relative overflow-hidden">
      <div className="relative z-10 h-screen flex">
        {/* Left Side - Video Feed and Violations (60%) */}
        <div className="w-3/5 bg-gradient-to-br from-purple-100/80 to-indigo-100/80 backdrop-blur-md border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Level 5 - AI Proctored Interview
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600">RECORDING</span>
              </div>
            </div>
          </div>

          {/* Video Feed - Made larger */}
          <div className="flex-1 p-4">
            <div className="bg-white/90 rounded-2xl p-4 h-4/5 flex flex-col mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Proctored Camera Feed</h3>
                <div className="flex items-center space-x-2 text-sm text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">LIVE</span>
                </div>
              </div>
              <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden relative">
                {isStartingCamera ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-white text-lg">Initializing proctored camera...</p>
                  </div>
                ) : cameraError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                    <VideoOff className="w-16 h-16 text-red-400 mb-4" />
                    <p className="text-red-400 text-lg mb-4">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="mt-4 px-6 py-3 bg-purple-500 text-white text-lg rounded-full hover:bg-purple-600 transition-colors"
                    >
                      Enable Camera (Required)
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
                    <p className="text-gray-400 text-lg mb-4">Camera Required for Proctored Interview</p>
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 bg-purple-500 text-white text-lg rounded-full hover:bg-purple-600 transition-colors"
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

            {/* Violation Logs - Made smaller */}
            <div className="bg-white/90 rounded-2xl p-4 h-1/5">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <h3 className="text-base font-semibold text-gray-700">Proctoring Violations</h3>
              </div>
              <div className="h-20 overflow-y-auto space-y-1">
                {violationLogs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
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
                      <AlertTriangle className={`w-3 h-3 mt-0.5 ${
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

        {/* Right Side - AI Interview Proctor (40%) */}
        <div className="w-2/5 flex flex-col">
          {/* AI Proctor Header */}
          <div className="bg-gradient-to-r from-purple-100/80 to-indigo-100/80 backdrop-blur-md p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-2xl">🎯</div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  AI Interview Proctor
                </h3>
                <p className="text-xs text-gray-600">Official proctored interview session</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600 font-medium">Recording</span>
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
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                      : 'bg-white/90 backdrop-blur-md text-gray-800 shadow-lg'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <div className="text-base">🎯</div>
                    )}
                    <div>
                      <p className="leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    rows={2}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim()}
                  className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
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
                <p className="text-green-800 font-semibold mb-2 text-sm">🎉 Interview Complete! 🎉</p>
                <p className="text-xs text-green-700 mb-3">Congratulations! You've completed all levels.</p>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg text-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full px-2 py-1 shadow-lg">
            <p className="text-xs font-medium text-gray-700">
              Question {Math.min(currentQuestionIndex + 1, interviewQuestions.length)} of {interviewQuestions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level5Flow;
