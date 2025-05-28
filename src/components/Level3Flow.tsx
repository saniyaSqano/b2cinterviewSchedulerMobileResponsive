
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, X } from 'lucide-react';
import Level3CongratulationsScreen from './Level3CongratulationsScreen';
import VideoFeed from './VideoFeed';

interface Level3FlowProps {
  onBack: () => void;
  userName: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

const Level3Flow: React.FC<Level3FlowProps> = ({ onBack, userName }) => {
  const [showCongratulations, setShowCongratulations] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    "Hi there! I'm excited to meet you. Could you please introduce yourself and tell me a bit about your background?",
    "That's wonderful! What motivates you to get up every morning and pursue your goals?",
    "I'd love to hear about your biggest achievement so far. What are you most proud of?",
    "What do you see as your greatest strength, and how has it helped you in your journey?",
    "If you could describe your dream job or career path, what would that look like?",
    "Finally, what message would you want to share with someone who's just starting their career journey?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Log when the component mounts to track initialization
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up camera...');
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsStartingCamera(true);
      setCameraError(null);
      console.log('Starting camera...');
      
      // Stop any existing stream first
      stopCamera();
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user'
        }, 
        audio: false 
      });
      
      console.log('Camera stream obtained successfully');
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Use a promise-based approach for better reliability
        await new Promise((resolve, reject) => {
          const video = videoRef.current!;
          
          const handleCanPlay = () => {
            console.log('Video can play, setting camera as ready');
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            setIsVideoOn(true);
            setIsStartingCamera(false);
            resolve(true);
          };
          
          const handleError = (error: Event) => {
            console.error('Video error:', error);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            reject(new Error('Video playback failed'));
          };
          
          video.addEventListener('canplay', handleCanPlay);
          video.addEventListener('error', handleError);
          
          // Shorter timeout for faster response
          setTimeout(() => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            console.log('Timeout reached, forcing camera ready state');
            setIsVideoOn(true);
            setIsStartingCamera(false);
            resolve(true);
          }, 2000);
        });
        
        // Attempt to play the video
        try {
          await videoRef.current.play();
          console.log('Video playback started successfully');
        } catch (playError) {
          console.warn('Video autoplay failed, but stream is active:', playError);
          // This is often due to browser autoplay policies, but the stream is still working
        }
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setIsStartingCamera(false);
      
      let errorMessage = 'Unable to access camera. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera access and refresh the page.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera is being used by another application.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Please check your camera permissions and try again.';
      }
      
      setCameraError(errorMessage);
      setIsVideoOn(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind, track.label);
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsVideoOn(false);
  };

  const handleProceedToInterview = () => {
    console.log('Proceeding to interview...');
    setShowCongratulations(false);
    
    // Start camera immediately when entering interview
    setTimeout(async () => {
      console.log('Auto-starting camera for interview...');
      await startCamera();
      
      // Start with the first question after a short delay
      setTimeout(() => {
        const firstQuestion: Message = {
          id: Date.now(),
          text: questions[0],
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

    // Check if we need to ask the next question
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        const nextQuestionIndex = currentQuestionIndex + 1;
        const nextQuestion: Message = {
          id: Date.now() + 1,
          text: questions[nextQuestionIndex],
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextQuestion]);
        setCurrentQuestionIndex(nextQuestionIndex);
      }, 1500);
    } else {
      // All questions completed
      setTimeout(() => {
        const completionMessage: Message = {
          id: Date.now() + 1,
          text: "Fantastic! You've completed the Pitch Yourself challenge beautifully. Your responses show great self-awareness and motivation. You're ready for the next level!",
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
      <Level3CongratulationsScreen
        onBack={onBack}
        onProceed={handleProceedToInterview}
        userName={userName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      <div className="relative z-10 h-screen flex">
        {/* Left Side - Video Feed (60%) */}
        <div className="w-3/5 bg-gradient-to-br from-pink-100/80 to-purple-100/80 backdrop-blur-md border-r border-white/20 flex flex-col">
          {/* Video Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Level 3 - Video Interview
              </h2>
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg"
                title="End Interview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Your Video Feed */}
          <div className="flex-1 p-6">
            <div className="bg-white/90 rounded-2xl p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Video</h3>
              <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden relative">
                {isStartingCamera ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-white text-lg">Starting camera...</p>
                    <p className="text-gray-300 text-sm mt-2">Please allow camera access if prompted</p>
                  </div>
                ) : cameraError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                    <VideoOff className="w-16 h-16 text-red-400 mb-4" />
                    <p className="text-red-400 text-lg mb-4">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="mt-4 px-6 py-3 bg-pink-500 text-white text-lg rounded-full hover:bg-pink-600 transition-colors"
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
                      className="px-6 py-3 bg-pink-500 text-white text-lg rounded-full hover:bg-pink-600 transition-colors"
                    >
                      Start Camera
                    </button>
                  </div>
                )}
              </div>
              
              {/* Video Controls */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={toggleVideo}
                  disabled={isStartingCamera}
                  className={`p-4 rounded-full transition-colors ${
                    isVideoOn 
                      ? 'bg-gray-200 hover:bg-gray-300' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  } ${isStartingCamera ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-4 rounded-full transition-colors ${
                    isMicOn 
                      ? 'bg-gray-200 hover:bg-gray-300' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - AI Coach and Chat (30%) */}
        <div className="w-2/5 flex flex-col">
          {/* AI Coach Area */}
          <div className="bg-gradient-to-r from-pink-100/80 to-purple-100/80 backdrop-blur-md p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              {/* Cartoon Lady Avatar */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-2xl">👩‍💼</div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  AI Interview Coach
                </h3>
                <p className="text-xs text-gray-600">Your friendly interview companion</p>
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
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'bg-white/90 backdrop-blur-md text-gray-800 shadow-lg'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <div className="text-base">👩‍💼</div>
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
                    placeholder="Share your thoughts here..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    rows={2}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim()}
                  className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
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
                <p className="text-green-800 font-semibold mb-2 text-sm">Level 3 Complete! 🎉</p>
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
              Question {Math.min(currentQuestionIndex + 1, questions.length)} of {questions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level3Flow;
