import React from 'react';
import { Phone } from 'lucide-react';

/**
 * HelpCallButton component
 * Provides a "Need help?" call button that can be placed anywhere in the application
 */
const HelpCallButton: React.FC = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900">Need help?</h3>
          <p className="text-sm text-gray-600 truncate">AI Assistant is here to help</p>
        </div>
      </div>
      
      <button className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-3 px-6 flex items-center justify-center space-x-2 transition-colors duration-200">
        <Phone className="w-4 h-4" />
        <span className="font-medium">Start a call</span>
      </button>
    </div>
  );
};

export default HelpCallButton;
