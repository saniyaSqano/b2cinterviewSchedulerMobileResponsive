
import React from 'react';
import { ArrowLeft, Video, Heart, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface Level3CongratulationsScreenProps {
  onBack: () => void;
  onProceed: () => void;
  userName: string;
}

const Level3CongratulationsScreen: React.FC<Level3CongratulationsScreenProps> = ({
  onBack,
  onProceed,
  userName
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      
      {/* Decorative background elements */}
      <div className="absolute top-16 left-8 w-24 h-24 bg-gradient-to-br from-pink-400/30 to-rose-400/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-16 right-8 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-indigo-400/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-full blur-xl"></div>
      
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-pink-50/80 via-purple-50/80 to-indigo-50/80 backdrop-blur-md border-b border-white/20 p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Welcome to Level 3!
                </h1>
                <p className="text-sm text-gray-600">Pitch Yourself Challenge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            {/* Congratulations Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 text-center">
              {/* Video Icon with Animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Video className="w-12 h-12 text-white" />
                  </div>
                  {/* Sparkle effects */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                    <Heart className="w-2 h-2 text-white" />
                  </div>
                </div>
              </div>

              {/* Congratulations Text */}
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4">
                Congratulations {userName}!
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                You're ready for Level 3 - the{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Pitch Yourself Challenge
                </span>
              </p>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-800 font-bold text-xl mb-3">Meet Your AI Interview Coach!</h3>
                <p className="text-gray-700 font-medium text-lg mb-2">
                  Get ready to meet our friendly AI coach who will guide you through your pitch practice.
                </p>
                <p className="text-gray-600 text-sm">
                  She'll ask you questions about your background, motivations, and help you craft the perfect self-introduction!
                </p>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-4 rounded-xl">
                  <Video className="w-6 h-6 text-pink-600 mb-2 mx-auto" />
                  <p className="text-sm font-semibold text-pink-800">Live Video Feed</p>
                  <p className="text-xs text-pink-700">Practice with real-time feedback</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-4 rounded-xl">
                  <Heart className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
                  <p className="text-sm font-semibold text-purple-800">Motivational Questions</p>
                  <p className="text-xs text-purple-700">Discover your strengths</p>
                </div>
              </div>

              {/* Proceed Button */}
              <Button
                onClick={onProceed}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Start Video Interview
                <Video className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level3CongratulationsScreen;
