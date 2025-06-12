
import React, { useState } from 'react';
import { Trophy, Star, Award, Brain, Users, Sparkles, CheckCircle, Clock, TrendingUp, User, LogOut } from 'lucide-react';
import AssessmentFlow from './AssessmentFlow';
import ChatFlow from './ChatFlow';
import Level3Flow from './Level3Flow';
import Level4Flow from './Level4Flow';
import GamethonFlow from './GamethonFlow';
import InteractiveRoadmap from './InteractiveRoadmap';
import ParticleBackground from './ParticleBackground';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 relative overflow-hidden">
      {/* Animated geometric shapes in background */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl transform rotate-45 opacity-20"></div>
      <div className="absolute bottom-40 right-40 w-48 h-48 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl transform -rotate-12 opacity-15"></div>
      <div className="absolute top-1/3 right-10 w-32 h-32 bg-gradient-to-br from-green-300 to-emerald-400 rounded-xl transform rotate-12 opacity-25"></div>
      
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-purple-800/90 backdrop-blur-md border-b border-purple-600/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-green-400 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-purple-800 font-bold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  ProctoVerse
                </h1>
                <p className="text-sm text-purple-200">AI-Powered Learning Platform</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-purple-200 hover:text-white transition-colors text-sm font-medium">
                Solutions
              </a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors text-sm font-medium">
                Resources
              </a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors text-sm font-medium">
                About
              </a>
              <div className="flex items-center space-x-4 ml-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">
                    {getTotalCredits()} Credits
                  </span>
                </div>
                <div className="w-px h-6 bg-purple-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-800" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {getUserDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-purple-200 hover:text-white hover:bg-purple-700 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-white">{getTotalCredits()}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-purple-200 hover:text-white rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 mb-6 leading-tight">
              AI learning made smart, secure, and seamless
            </h1>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master your skills with our comprehensive AI-powered platform. Progress through levels, earn credits, and unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleCardClick(currentLevel)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Continue Learning
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-purple-400 text-purple-200 rounded-xl font-semibold hover:bg-purple-400 hover:text-purple-900 transition-all duration-300">
                View Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="relative z-10 bg-white/5 backdrop-blur-sm border-y border-purple-600/20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white mb-4">
              A new standard in AI-powered learning
            </h2>
            <p className="text-lg text-purple-200 max-w-4xl mx-auto">
              Our AI learning platform is the ideal solution for individuals and organizations seeking comprehensive, 
              scalable, and flexible skill development. It reduces learning time, increases retention, and delivers 
              measurable results through personalized AI guidance.
            </p>
          </div>

          {/* Level Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/20">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <span className="text-sm font-medium text-purple-200">Current Level</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{currentLevel + 1}</div>
              <div className="text-sm text-purple-200">of 5 levels</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/20">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <span className="text-sm font-medium text-purple-200">Completed</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{completedLevels.length}</div>
              <div className="text-sm text-purple-200">modules completed</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/20">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-yellow-400" />
                <span className="text-sm font-medium text-purple-200">Credits Earned</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{getTotalCredits()}</div>
              <div className="text-sm text-purple-200">total credits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Roadmap */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <InteractiveRoadmap
            currentLevel={currentLevel}
            completedLevels={completedLevels}
            onStepClick={handleCardClick}
            levelCredits={levelCredits}
          />
        </div>
      </div>

      {/* Achievement Section */}
      {completedLevels.length > 0 && (
        <div className="relative z-10 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-purple-400/20 shadow-2xl">
              <h3 className="text-white font-bold text-2xl mb-6 flex items-center justify-center">
                <Award className="w-6 h-6 mr-2 text-yellow-400" />
                Achievement Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {completedLevels.map((level) => (
                  <div key={level} className="flex items-center justify-between bg-gradient-to-r from-purple-600/30 to-purple-700/30 rounded-xl px-4 py-3 border border-purple-400/20">
                    <span className="text-purple-200 text-sm font-medium">Module {level + 1}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-bold">{levelCredits[level as keyof typeof levelCredits]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-purple-400/20 shadow-2xl text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-green-400 rounded-2xl flex items-center justify-center mr-4 animate-spin-slow">
                <Sparkles className="w-8 h-8 text-purple-800" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white">Continue Your Journey</h3>
                <p className="text-purple-200">Unlock your potential with AI-powered learning</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="font-semibold text-white mb-1">Certified Training</div>
                <div className="text-sm text-purple-200">Industry-recognized certifications</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 animate-bounce-subtle">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div className="font-semibold text-white mb-1">AI-Powered Learning</div>
                <div className="text-sm text-purple-200">Personalized feedback and guidance</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 animate-wiggle">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="font-semibold text-white mb-1">Career Growth</div>
                <div className="text-sm text-purple-200">Proven results and outcomes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelsContent;
