import React, { useState } from 'react';
import { ArrowLeft, Trophy, Star, Award, Brain, Users, Sparkles, Target, Rocket, Code, Globe, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import AssessmentFlow from '../components/AssessmentFlow';
import ChatFlow from '../components/ChatFlow';
import Level3Flow from '../components/Level3Flow';
import Level4Flow from '../components/Level4Flow';
import GamethonFlow from '../components/GamethonFlow';
import InteractiveRoadmap from '../components/InteractiveRoadmap';
import { useUser } from '../contexts/UserContext';

const Index = () => {
  return <LevelsContent />;
};

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Professional Background with Subtle Animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
        
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-indigo-400/40 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Simplified Header */}
      <div className="relative z-20 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogout}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <p className="text-sm text-gray-600 font-medium">Professional Development Platform</p>
              </div>
            </div>
            
            {/* Professional User Profile Section */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 bg-white rounded-xl px-5 py-3 border border-gray-200/70 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-gray-900 font-bold text-lg">{getTotalCredits()}</span>
                    <span className="text-gray-600 text-sm ml-1">Credits</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200/70">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{getUserDisplayName().charAt(0)}</span>
                </div>
                <div>
                  <span className="text-gray-900 font-semibold">{getUserDisplayName()}</span>
                  <div className="text-xs text-gray-500">Level {currentLevel + 1}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section with ProctoVerse as Main Title */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
          {/* Main Application Title */}
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse-glow">
                ProctoVerse
              </span>
            </h1>
            <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 text-sm font-medium border border-gray-200/50 shadow-sm">
              <Brain className="w-4 h-4 mr-2 text-blue-600" />
              AI-Powered Professional Development
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Accelerate Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Career Growth
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Master professional skills through AI-guided training, personalized feedback, and industry-standard assessments
          </p>

          <div className="flex justify-center flex-wrap gap-8 mb-12">
            <div className="flex items-center space-x-2 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Industry Certified</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">10,000+ Professionals</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">95% Success Rate</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">24/7 AI Support</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                {completedLevels.length}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">Modules Completed</div>
              <div className="text-lg font-bold text-gray-900">{completedLevels.length} of 5</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                {Math.round((completedLevels.length / 5) * 100)}%
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">Overall Progress</div>
              <div className="text-lg font-bold text-gray-900">Course Completion</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">Credits Earned</div>
              <div className="text-lg font-bold text-gray-900">{getTotalCredits()} Points</div>
            </div>
          </div>

          {completedLevels.length > 0 && (
            <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm max-w-3xl mx-auto">
              <h3 className="text-gray-900 font-bold text-xl mb-6 flex items-center justify-center">
                <Award className="w-6 h-6 mr-2 text-blue-500" />
                Achievement Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {completedLevels.map((level) => (
                  <div key={level} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200/50">
                    <span className="text-gray-700 text-sm font-medium">Module {level + 1}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-900 font-bold">{levelCredits[level as keyof typeof levelCredits]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Learning Journey</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow our structured path to master professional skills and advance your career
            </p>
          </div>
          
          <InteractiveRoadmap
            currentLevel={currentLevel}
            completedLevels={completedLevels}
            onStepClick={handleCardClick}
            levelCredits={levelCredits}
          />
        </div>

        <div className="text-center mt-20 pb-16">
          <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900">Ready to Transform Your Career?</h3>
                <p className="text-gray-600">Join thousands of professionals who've accelerated their growth</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">Certified Training</div>
                <div className="text-sm text-gray-600">Industry-recognized certifications</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">AI-Powered Learning</div>
                <div className="text-sm text-gray-600">Personalized feedback and guidance</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
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

export default Index;

}
