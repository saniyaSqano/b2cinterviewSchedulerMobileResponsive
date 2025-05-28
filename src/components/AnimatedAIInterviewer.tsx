
import React, { useState, useEffect } from 'react';

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
  const [avatarExpression, setAvatarExpression] = useState('neutral');

  useEffect(() => {
    if (currentQuestion && isAsking) {
      setIsTyping(true);
      setDisplayedText('');
      setShowThinking(true);
      setAvatarExpression('thinking');
      
      // Show thinking animation for 1 second
      setTimeout(() => {
        setShowThinking(false);
        setAvatarExpression('speaking');
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
        setAvatarExpression('listening');
        // Give user time to read the question
        setTimeout(() => {
          onQuestionComplete();
        }, 1000);
      }
    }, 50);
  };

  const renderAvatar = () => {
    const baseClasses = "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl";
    
    if (showThinking) {
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse scale-105`}>
          <div className="text-5xl">🤔</div>
        </div>
      );
    }
    
    if (isSpeaking) {
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-green-400 to-blue-500 ${isTyping ? 'animate-bounce' : ''}`}>
          <div className="text-5xl animate-pulse">😊</div>
        </div>
      );
    }
    
    if (avatarExpression === 'listening') {
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-yellow-400 to-orange-500`}>
          <div className="text-5xl">👂</div>
        </div>
      );
    }
    
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-purple-400 to-pink-500`}>
        <div className="text-5xl">🤖</div>
      </div>
    );
  };

  return (
    <div className="w-2/5 flex flex-col bg-gradient-to-br from-purple-50/90 to-pink-50/90 backdrop-blur-md">
      {/* AI Interviewer Header */}
      <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-md p-6 border-b border-white/20">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {renderAvatar()}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              AI Interview Coach
            </h3>
            <p className="text-sm text-gray-600">Your friendly interview companion</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">
                {showThinking ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Listening...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Main Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-8">
          {renderAvatar()}
        </div>
        
        {/* Speech Animation */}
        {isSpeaking && (
          <div className="flex space-x-2 mb-6">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        )}
      </div>

      {/* AI Speech Bubble */}
      <div className="p-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 relative">
          {/* Speech bubble arrow */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[15px] border-b-white/90"></div>
          
          {showThinking ? (
            <div className="flex items-center justify-center space-x-2 text-gray-600 py-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm italic">Preparing your question...</span>
            </div>
          ) : (
            <div>
              <p className="text-gray-800 text-lg leading-relaxed mb-4">
                {displayedText}
                {isTyping && <span className="animate-pulse text-blue-500">|</span>}
              </p>
              
              {!isAsking && !isTyping && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Take your time to answer...</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Response Instructions */}
      {!isAsking && !isTyping && (
        <div className="p-6 bg-white/80 backdrop-blur-md border-t border-white/20">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Speak clearly and take your time. The AI is listening and will automatically move to the next question.
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">Recording Your Response</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedAIInterviewer;
