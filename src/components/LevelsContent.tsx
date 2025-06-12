
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl transform rotate-45 opacity-30"></div>
      <div className="absolute bottom-40 right-40 w-48 h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl transform -rotate-12 opacity-20"></div>
      <div className="absolute top-1/3 right-10 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl transform rotate-12 opacity-25"></div>
      
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white font-bold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ProctoVerse
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Learning Platform</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                Solutions
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                Resources
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                About
              </a>
              <div className="flex items-center space-x-4 ml-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {getTotalCredits()} Credits
                  </span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-gray-900">{getTotalCredits()}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg"
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
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-6 leading-tight">
              AI learning made smart, secure, and seamless
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master your skills with our comprehensive AI-powered platform. Progress through levels, earn credits, and unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleCardClick(currentLevel)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Continue Learning
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all duration-300">
                View Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              A new standard in AI-powered learning
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Our AI learning platform is the ideal solution for individuals and organizations seeking comprehensive, 
              scalable, and flexible skill development. It reduces learning time, increases retention, and delivers 
              measurable results through personalized AI guidance.
            </p>
          </div>

          {/* Level Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">Current Level</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{currentLevel + 1}</div>
              <div className="text-sm text-gray-600">of 5 levels</div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Completed</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{completedLevels.length}</div>
              <div className="text-sm text-gray-600">modules completed</div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">Credits Earned</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{getTotalCredits()}</div>
              <div className="text-sm text-gray-600">total credits</div>
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
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-gray-900 font-bold text-2xl mb-6 flex items-center justify-center">
                <Award className="w-6 h-6 mr-2 text-yellow-500" />
                Achievement Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {completedLevels.map((level) => (
                  <div key={level} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3 border border-gray-200">
                    <span className="text-gray-700 text-sm font-medium">Module {level + 1}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-900 font-bold">{levelCredits[level as keyof typeof levelCredits]}</span>
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
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 border border-gray-200 shadow-lg text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 animate-spin-slow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900">Continue Your Journey</h3>
                <p className="text-gray-600">Unlock your potential with AI-powered learning</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">Certified Training</div>
                <div className="text-sm text-gray-600">Industry-recognized certifications</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 animate-bounce-subtle">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">AI-Powered Learning</div>
                <div className="text-sm text-gray-600">Personalized feedback and guidance</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3 animate-wiggle">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">Career Growth</div>
                <div className="text-sm text-gray-600">Proven results and outcomes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelsContent;
