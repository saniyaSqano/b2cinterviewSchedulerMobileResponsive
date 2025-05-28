
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

  useEffect(() => {
    if (currentQuestion && isAsking) {
      setIsTyping(true);
      setDisplayedText('');
      setShowThinking(true);
      
      // Show thinking animation for 1 second
      setTimeout(() => {
        setShowThinking(false);
        typeText(currentQuestion);
      }, 1000);
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
        // Give user time to read the question
        setTimeout(() => {
          onQuestionComplete();
        }, 1000);
      }
    }, 50);
  };

  return (
    <div className="w-2/5 flex flex-col bg-gradient-to-br from-purple-50/90 to-pink-50/90 backdrop-blur-md">
      {/* AI Interviewer Header */}
      <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-md p-6 border-b border-white/20">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              isTyping ? 'animate-pulse scale-110' : 'scale-100'
            }`}>
              <div className="text-3xl">🤖</div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              AI Interview Coach
            </h3>
            <p className="text-sm text-gray-600">Your friendly interview companion</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Speech Bubble */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 relative">
          {/* Speech bubble arrow */}
          <div className="absolute -left-3 top-8 w-0 h-0 border-t-[12px] border-t-transparent border-r-[15px] border-r-white/90 border-b-[12px] border-b-transparent"></div>
          
          {showThinking ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm italic">Thinking...</span>
            </div>
          ) : (
            <div>
              <p className="text-gray-800 text-lg leading-relaxed mb-4">
                {displayedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
              
              {!isAsking && !isTyping && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Listening for your response...</span>
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
              Take your time to think and answer out loud. The AI will listen and move to the next question automatically.
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
