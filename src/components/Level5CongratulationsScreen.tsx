
import React from 'react';
import { ArrowLeft, Trophy, Star, CheckCircle } from 'lucide-react';

interface Level5CongratulationsScreenProps {
  onBack: () => void;
  onProceed: () => void;
  userName: string;
}

const Level5CongratulationsScreen: React.FC<Level5CongratulationsScreenProps> = ({ 
  onBack, 
  onProceed, 
  userName 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              Level 5 - AI Proctored Interview
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-2xl mx-auto text-center shadow-2xl">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
                Welcome to Level 5!
              </h1>
              
              <p className="text-xl text-gray-700 mb-6">
                Congratulations, {userName}! 🎉
              </p>
              
              <p className="text-gray-600 leading-relaxed mb-8">
                You've successfully completed all practice levels and are now ready for the ultimate challenge - 
                the AI Proctored Interview. This is your final assessment where you'll demonstrate all the skills 
                you've developed throughout your journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 mb-1">Real-time Monitoring</h3>
                <p className="text-sm text-blue-700">Advanced AI proctoring technology</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl">
                <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 mb-1">Professional Assessment</h3>
                <p className="text-sm text-purple-700">Industry-standard evaluation</p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl">
                <Trophy className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <h3 className="font-semibold text-indigo-900 mb-1">Final Certification</h3>
                <p className="text-sm text-indigo-700">Complete your journey</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={onProceed}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg transform hover:scale-105"
              >
                Start AI Proctored Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level5CongratulationsScreen;
