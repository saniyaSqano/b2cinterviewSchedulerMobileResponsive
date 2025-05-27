
import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface Level5HeaderProps {
  onBack: () => void;
  onEndInterview: () => void;
}

const Level5Header: React.FC<Level5HeaderProps> = ({ onBack, onEndInterview }) => {
  return (
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
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-600">RECORDING</span>
          </div>
          <button
            onClick={onEndInterview}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg"
            title="End Interview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Level5Header;
