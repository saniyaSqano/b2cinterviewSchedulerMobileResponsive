
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface AnimatedAIInterviewerProps {
  currentQuestion: string;
  isAsking: boolean;
  onQuestionComplete: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const AnimatedAIInterviewer: React.FC<AnimatedAIInterviewerProps> = ({
  currentQuestion,
  isAsking,
  onQuestionComplete,
  currentQuestionIndex,
  totalQuestions
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [avatarState, setAvatarState] = useState('neutral');

  useEffect(() => {
    if (currentQuestion && isAsking) {
      setIsTyping(true);
      setDisplayedText('');
      setShowThinking(true);
      setAvatarState('thinking');
      
      // Show thinking animation for 1.5 seconds
      setTimeout(() => {
        setShowThinking(false);
        setAvatarState('speaking');
        setIsSpeaking(true);
        typeText(currentQuestion);
      }, 1500);
    }
  }, [currentQuestion, isAsking]);

  const typeText = (text: string) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setIsSpeaking(false);
        setAvatarState('listening');
        // Give user time to read the question
        setTimeout(() => {
          onQuestionComplete();
        }, 1000);
      }
    }, 50);
  };

  const renderProfessionalAvatar = () => {
    const baseClasses = "relative";
    
    return (
      <div className={baseClasses}>
        <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
          <AvatarFallback className={`text-2xl font-bold transition-all duration-500 ${
            avatarState === 'thinking' ? 'bg-blue-100 text-blue-600' :
            avatarState === 'speaking' ? 'bg-green-100 text-green-600' :
            avatarState === 'listening' ? 'bg-purple-100 text-purple-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            AI
          </AvatarFallback>
        </Avatar>
        
        {/* Status Indicator */}
        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center transition-all duration-300 ${
          avatarState === 'thinking' ? 'bg-blue-500' :
          avatarState === 'speaking' ? 'bg-green-500 animate-pulse' :
          avatarState === 'listening' ? 'bg-purple-500' :
          'bg-gray-400'
        }`}>
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-2/5 flex flex-col bg-white/95 backdrop-blur-sm border-l border-gray-200">
      {/* AI Interviewer Header */}
      <div className="bg-gray-50/90 backdrop-blur-sm p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {renderProfessionalAvatar()}
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">
              AI Interview Assistant
            </h3>
            <p className="text-sm text-gray-600">Professional Interview Evaluation</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className={`w-2 h-2 rounded-full transition-colors ${
                showThinking ? 'bg-blue-500 animate-pulse' :
                isSpeaking ? 'bg-green-500 animate-pulse' :
                'bg-purple-500 animate-pulse'
              }`}></div>
              <span className="text-sm text-gray-600 font-medium">
                {showThinking ? 'Preparing question...' : 
                 isSpeaking ? 'Asking question...' : 
                 'Awaiting response...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="text-center mb-8">
          {renderProfessionalAvatar()}
        </div>
        
        {/* Professional Speech Indicators */}
        {isSpeaking && (
          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-2 h-8 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-6 bg-gradient-to-t from-green-400 to-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-10 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-7 bg-gradient-to-t from-indigo-400 to-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          </div>
        )}
      </div>

      {/* Question Display */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 relative">
          <div className="absolute -top-3 left-6 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[15px] border-b-gray-50"></div>
          
          {showThinking ? (
            <div className="flex items-center space-x-3 text-gray-600 py-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm">Formulating your interview question...</span>
            </div>
          ) : (
            <div>
              <p className="text-gray-800 text-lg leading-relaxed mb-4 font-medium">
                {displayedText}
                {isTyping && <span className="animate-pulse text-blue-500 font-normal">|</span>}
              </p>
              
              {!isAsking && !isTyping && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>Please provide your response</span>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {currentQuestionIndex + 1} / {totalQuestions}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Response Instructions */}
      {!isAsking && !isTyping && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Please speak clearly and take your time. The system will automatically proceed to the next question.
            </p>
            <div className="flex justify-center items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">Recording</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedAIInterviewer;
