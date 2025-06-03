
import React, { useState } from 'react';
import { ArrowLeft, Trophy, Star, Award } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import AssessmentFlow from '../components/AssessmentFlow';
import ChatFlow from '../components/ChatFlow';
import Level3Flow from '../components/Level3Flow';
import Level4Flow from '../components/Level4Flow';
import Level5Flow from '../components/Level5Flow';
import InteractiveRoadmap from '../components/InteractiveRoadmap';

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLevel3, setShowLevel3] = useState(false);
  const [showLevel4, setShowLevel4] = useState(false);
  const [showLevel5, setShowLevel5] = useState(false);
  const [assessmentScore] = useState(70);

  // Credits earned per level
  const levelCredits = {
    0: 100, // Skill Assessment
    1: 150, // AI Mentor Chat
    2: 200, // Pitch Builder
    3: 250, // Practice Hub
    4: 300, // Proctored Interview
    5: 500  // Leaderboard Challenge
  };

  const getTotalCredits = () => {
    return completedLevels.reduce((total, level) => total + (levelCredits[level as keyof typeof levelCredits] || 0), 0);
  };

  const handleCardClick = (index: number) => {
    console.log(`Starting level ${index}`);
    
    if (index === 0) {
      setShowAssessment(true);
      return;
    }
    
    if (index === 1) {
      setShowChat(true);
      return;
    }

    if (index === 2) {
      setShowLevel3(true);
      return;
    }

    if (index === 3) {
      setShowLevel4(true);
      return;
    }

    if (index === 4) {
      setShowLevel5(true);
      return;
    }

    if (index === 5) {
      console.log('GameOn feature coming soon!');
      return;
    }
    
    setTimeout(() => {
      if (!completedLevels.includes(index)) {
        setCompletedLevels(prev => [...prev, index]);
        if (index === currentLevel && currentLevel < 5) {
          setCurrentLevel(prev => prev + 1);
        }
      }
    }, 2000);
  };

  const handleTestPassed = () => {
    if (!completedLevels.includes(0)) {
      setCompletedLevels(prev => [...prev, 0]);
      setCurrentLevel(1);
    }
  };

  const handleChatCompleted = () => {
    if (!completedLevels.includes(1)) {
      setCompletedLevels(prev => [...prev, 1]);
      setCurrentLevel(2);
    }
  };

  const handleLevel3Completed = () => {
    if (!completedLevels.includes(2)) {
      setCompletedLevels(prev => [...prev, 2]);
      setCurrentLevel(3);
    }
  };

  const handleLevel4Completed = () => {
    if (!completedLevels.includes(3)) {
      setCompletedLevels(prev => [...prev, 3]);
      setCurrentLevel(4);
    }
  };

  const handleLevel5Completed = () => {
    if (!completedLevels.includes(4)) {
      setCompletedLevels(prev => [...prev, 4]);
      setCurrentLevel(5);
    }
  };

  if (showAssessment) {
    return (
      <AssessmentFlow 
        onBack={() => setShowAssessment(false)}
        onTestPassed={handleTestPassed}
      />
    );
  }

  if (showChat) {
    return (
      <ChatFlow 
        onBack={() => {
          setShowChat(false);
          handleChatCompleted();
        }}
        userName="Revati"
        assessmentScore={assessmentScore}
      />
    );
  }

  if (showLevel3) {
    return (
      <Level3Flow 
        onBack={() => {
          setShowLevel3(false);
          handleLevel3Completed();
        }}
        userName="Revati"
      />
    );
  }

  if (showLevel4) {
    return (
      <Level4Flow 
        onBack={() => {
          setShowLevel4(false);
          handleLevel4Completed();
        }}
        userName="Revati"
      />
    );
  }

  if (showLevel5) {
    return (
      <Level5Flow 
        onBack={() => {
          setShowLevel5(false);
          handleLevel5Completed();
        }}
        userName="Revati"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Top Navigation Bar */}
      <div className="relative z-20 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Proctoverse
                </h1>
              </div>
            </div>
            
            {/* User Profile & Credits */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-700 font-semibold">{getTotalCredits()}</span>
                  <span className="text-purple-600 text-sm">Credits</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">R</span>
                </div>
                <span className="text-gray-700 font-medium">Revati</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm animate-bounce-subtle">
            🤖 AI-Powered Professional Development
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            Welcome to <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Proctoverse</span>
          </h2>
          
          <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            Your AI-guided journey to interview mastery through intelligent learning and personalized feedback
          </p>

          {/* Progress Stats with Credits Display */}
          <div className="flex items-center justify-center space-x-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto border border-white/30 animate-pulse-glow">
                {completedLevels.length}
              </div>
              <div className="text-sm text-purple-200">Levels Complete</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto border border-white/30 animate-pulse-glow">
                {Math.round((completedLevels.length / 6) * 100)}%
              </div>
              <div className="text-sm text-purple-200">Progress</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto border border-yellow-300/50 animate-pulse-glow">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="text-sm text-purple-200">{getTotalCredits()} Credits</div>
            </div>
          </div>

          {/* Credits Breakdown */}
          {completedLevels.length > 0 && (
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <h3 className="text-white font-semibold mb-4 flex items-center justify-center">
                <Award className="w-5 h-5 mr-2" />
                Credits Earned
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {completedLevels.map((level) => (
                  <div key={level} className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-purple-200 text-sm">Level {level + 1}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-semibold">{levelCredits[level as keyof typeof levelCredits]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Roadmap */}
        <div className="max-w-7xl mx-auto px-6">
          <InteractiveRoadmap
            currentLevel={currentLevel}
            completedLevels={completedLevels}
            onStepClick={handleCardClick}
            levelCredits={levelCredits}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
