
import React from 'react';
import { ArrowLeft, Trophy, Star, Target } from 'lucide-react';
import { Button } from './ui/button';

interface CongratulationsScreenProps {
  onBack: () => void;
  onProceed: () => void;
  userName: string;
  assessmentScore: number;
}

const CongratulationsScreen: React.FC<CongratulationsScreenProps> = ({
  onBack,
  onProceed,
  userName,
  assessmentScore
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-xl"></div>
      
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-md border-b border-white/20 p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Level 1 Complete!
                </h1>
                <p className="text-sm text-gray-600">Assessment Results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            {/* Congratulations Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 text-center">
              {/* Trophy Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  {/* Sparkle effects */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 text-white" />
                  </div>
                </div>
              </div>

              {/* Congratulations Text */}
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                Congratulations {userName}!
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                You have completed Level 1 successfully with{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  {assessmentScore}%
                </span>
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
                <p className="text-gray-800 font-medium text-lg">
                  Now let's start with the second level of interview.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Get ready for an AI-powered conversation that will help you showcase your skills!
                </p>
              </div>

              {/* Score Badge */}
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full shadow-lg">
                  <div className="text-sm font-semibold">Assessment Score</div>
                  <div className="text-2xl font-bold">{assessmentScore}%</div>
                </div>
              </div>

              {/* Proceed Button */}
              <Button
                onClick={onProceed}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Proceed to Level 2
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CongratulationsScreen;
