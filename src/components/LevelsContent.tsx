
import React, { useState } from 'react';
import { Trophy, Star, Award, Brain, Users, Sparkles, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import AssessmentFlow from './AssessmentFlow';
import ChatFlow from './ChatFlow';
import Level3Flow from './Level3Flow';
import Level4Flow from './Level4Flow';
import GamethonFlow from './GamethonFlow';
import InteractiveRoadmap from './InteractiveRoadmap';
import { useUser } from '../contexts/UserContext';

const LevelsContent = () => {
  const { user, setUser } = useUser();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLevel3, setShowLevel3] = useState(false);
  const [showLevel4, setShowLevel4] = useState(false);
  const [showGamethon, setShowGamethon] = useState(false);
  const [assessmentScore] = useState(70);

  // Credits earned per level (updated for 5 levels)
  const levelCredits = {
    0: 100, // Skill Assessment
    1: 150, // AI Mentor Chat
    2: 200, // Pitch Builder
    3: 250, // Proctored Interview
    4: 500  // Gamethon
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
      setShowGamethon(true);
      return;
    }
    
    setTimeout(() => {
      if (!completedLevels.includes(index)) {
        setCompletedLevels(prev => [...prev, index]);
        if (index === currentLevel && currentLevel < 4) {
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

  const handleGamethonCompleted = () => {
    if (!completedLevels.includes(4)) {
      setCompletedLevels(prev => [...prev, 4]);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Get user's first name
  const getUserDisplayName = () => {
    if (!user?.name) return 'User';
    const firstName = user.name.split(' ')[0];
    return firstName;
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
        userName={getUserDisplayName()}
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
        userName={getUserDisplayName()}
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
        userName={getUserDisplayName()}
      />
    );
  }

  if (showGamethon) {
    return (
      <GamethonFlow 
        onBack={() => {
          setShowGamethon(false);
          handleGamethonCompleted();
        }}
        userName={getUserDisplayName()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ProctoVerse
              </span>
            </h1>
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
              <Brain className="w-4 h-4 mr-2 text-blue-400" />
              Your Professional Journey
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
            Welcome back,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {getUserDisplayName()}
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-10">
            Continue your journey through our structured learning path designed to master professional skills
          </p>

          {/* Progress Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                {completedLevels.length}
              </div>
              <div className="text-sm font-medium text-blue-200 mb-1">Modules Completed</div>
              <div className="text-lg font-bold text-white">{completedLevels.length} of 5</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                {Math.round((completedLevels.length / 5) * 100)}%
              </div>
              <div className="text-sm font-medium text-blue-200 mb-1">Overall Progress</div>
              <div className="text-lg font-bold text-white">Course Completion</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="text-sm font-medium text-blue-200 mb-1">Credits Earned</div>
              <div className="text-lg font-bold text-white">{getTotalCredits()} Points</div>
            </div>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Your Learning Roadmap</h3>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Progress through each level to unlock new challenges and build expertise
            </p>
          </div>
          
          <InteractiveRoadmap
            currentLevel={currentLevel}
            completedLevels={completedLevels}
            onStepClick={handleCardClick}
            levelCredits={levelCredits}
          />
        </div>

        {/* Achievement Section */}
        {completedLevels.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 mt-16">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center justify-center">
                <Award className="w-6 h-6 mr-2 text-blue-400" />
                Achievement Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {completedLevels.map((level) => (
                  <div key={level} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 border border-white/20">
                    <span className="text-blue-100 text-sm font-medium">Module {level + 1}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-bold">{levelCredits[level as keyof typeof levelCredits]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-20 pb-16">
          <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white">Continue Your Journey</h3>
                <p className="text-blue-100">Unlock your potential with AI-powered learning</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="font-semibold text-white mb-1">Certified Training</div>
                <div className="text-sm text-blue-200">Industry-recognized certifications</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div className="font-semibold text-white mb-1">AI-Powered Learning</div>
                <div className="text-sm text-blue-200">Personalized feedback and guidance</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div className="font-semibold text-white mb-1">Career Growth</div>
                <div className="text-sm text-blue-200">Proven results and outcomes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelsContent;
