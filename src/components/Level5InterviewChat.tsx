
import React, { useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

interface Level5InterviewChatProps {
  messages: Message[];
  currentInput: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isComplete: boolean;
  onEndInterview: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const Level5InterviewChat: React.FC<Level5InterviewChatProps> = ({
  messages,
  currentInput,
  onInputChange,
  onSendMessage,
  isComplete,
  onEndInterview,
  currentQuestionIndex,
  totalQuestions
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
                placeholder="Type your response here..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                rows={2}
              />
            </div>
            <button
              onClick={onSendMessage}
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
              onClick={onEndInterview}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg text-sm"
            >
              View Report
            </button>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full px-2 py-1 shadow-lg">
        <p className="text-xs font-medium text-gray-700">
          Question {Math.min(currentQuestionIndex + 1, totalQuestions)} of {totalQuestions}
        </p>
      </div>
    </div>
  );
};

export default Level5InterviewChat;
