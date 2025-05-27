
import React from 'react';
import { ArrowLeft, Target, Shield, Camera, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface Level4CongratulationsScreenProps {
  onBack: () => void;
  onProceed: () => void;
  userName: string;
}

const Level4CongratulationsScreen: React.FC<Level4CongratulationsScreenProps> = ({
  onBack,
  onProceed,
  userName
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      
      {/* Decorative background elements */}
      <div className="absolute top-16 left-8 w-24 h-24 bg-gradient-to-br from-indigo-400/30 to-blue-400/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-16 right-8 w-32 h-32 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-gradient-to-br from-teal-400/30 to-cyan-400/30 rounded-full blur-xl"></div>
      
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-blue-50/80 to-cyan-50/80 backdrop-blur-md border-b border-white/20 p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  Welcome to Level 4!
                </h1>
                <p className="text-sm text-gray-600">Self Practice Challenge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            {/* Congratulations Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 text-center">
              {/* Icon with Animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Target className="w-12 h-12 text-white" />
                  </div>
                  {/* Sparkle effects */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2 h-2 text-white" />
                  </div>
                </div>
              </div>

              {/* Congratulations Text */}
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-4">
                Congratulations {userName}!
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                You're ready for Level 4 - the{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  Self Practice Challenge
                </span>
              </p>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-800 font-bold text-xl mb-3">Practice Makes Perfect!</h3>
                <p className="text-gray-700 font-medium text-lg mb-2">
                  Get ready for an AI-monitored practice session with real-time feedback and violation tracking.
                </p>
                <p className="text-gray-600 text-sm">
                  This session will help you prepare for the final proctored interview with confidence!
                </p>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-4 rounded-xl">
                  <Camera className="w-6 h-6 text-indigo-600 mb-2 mx-auto" />
                  <p className="text-sm font-semibold text-indigo-800">Live Camera Feed</p>
                  <p className="text-xs text-indigo-700">Real-time video monitoring</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
                  <p className="text-sm font-semibold text-blue-800">AI Practice Coach</p>
                  <p className="text-xs text-blue-700">Interactive practice questions</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-100 to-teal-100 p-4 rounded-xl">
                  <Shield className="w-6 h-6 text-cyan-600 mb-2 mx-auto" />
                  <p className="text-sm font-semibold text-cyan-800">Violation Tracking</p>
                  <p className="text-xs text-cyan-700">Real-time monitoring logs</p>
                </div>
              </div>

              {/* Proceed Button */}
              <Button
                onClick={onProceed}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Start Practice Session
                <Target className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level4CongratulationsScreen;
