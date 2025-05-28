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
    console.log('Video interview component mounted');
  }, []);

  // Handle video status changes from the VideoFeed component
  const handleVideoStatusChange = (status: boolean) => {
    console.log('Video status changed:', status);
    setIsVideoOn(status);
  };

  const handleProceedToInterview = () => {
    console.log('Proceeding to interview...');
    setShowCongratulations(false);
    
    // Start with the first question immediately
    setTimeout(() => {
      const firstQuestion: Message = {
        id: Date.now(),
        text: questions[0],
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([firstQuestion]);
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
            <VideoFeed onStatusChange={handleVideoStatusChange} />
          </div>
          
          {/* Audio Controls */}
          <div className="p-4 flex justify-center">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-4 rounded-full transition-colors ${
                isMicOn 
                  ? 'bg-gray-200 hover:bg-gray-300' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isMicOn ? "Turn Microphone Off" : "Turn Microphone On"}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Right Side - AI Coach and Chat (40%) */}
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
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                      : 'bg-white/90 text-gray-800'
                  } shadow-md`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 text-right mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          {!isComplete ? (
            <div className="p-3 bg-white/80 backdrop-blur-md border-t border-white/20">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 bg-white/80 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim()}
                  className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-white/20 text-center">
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-md hover:from-pink-600 hover:to-purple-600 transition-colors"
              >
                Complete Interview
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {currentQuestionIndex + 1} of {questions.length} questions completed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Level3Flow;
