
import React, { useState } from 'react';
import { ArrowLeft, Trophy, Star, Award, Brain, Users, Sparkles, Target, Rocket, Code, Globe } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import AssessmentFlow from '../components/AssessmentFlow';
import ChatFlow from '../components/ChatFlow';
import Level3Flow from '../components/Level3Flow';
import Level4Flow from '../components/Level4Flow';
import InteractiveRoadmap from '../components/InteractiveRoadmap';

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLevel3, setShowLevel3] = useState(false);
  const [showLevel4, setShowLevel4] = useState(false);
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
      console.log('Gamethon feature coming soon!');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes with better animations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Moving gradient orbs */}
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-indigo-300/30 to-purple-300/30 rounded-full blur-2xl animate-bounce delay-2000" style={{ animationDuration: '6s' }}></div>
        
        {/* Enhanced floating icons with motion */}
        <div className="absolute top-16 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <Target className="w-10 h-10 text-blue-400/50" />
        </div>
        <div className="absolute bottom-1/4 left-1/5 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
          <Award className="w-8 h-8 text-indigo-400/50" />
        </div>
        <div className="absolute top-1/3 right-1/6 animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
          <Rocket className="w-9 h-9 text-cyan-400/50" />
        </div>
        <div className="absolute top-3/4 left-1/3 animate-bounce" style={{ animationDelay: '4s', animationDuration: '4.5s' }}>
          <Code className="w-7 h-7 text-purple-400/50" />
        </div>
        <div className="absolute bottom-1/2 right-1/5 animate-bounce" style={{ animationDelay: '5s', animationDuration: '6s' }}>
          <Globe className="w-8 h-8 text-blue-500/50" />
        </div>
        
        {/* Enhanced floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 8}s`
            }}
          ></div>
        ))}
      </div>

      {/* Top Navigation Bar */}
      <div className="relative z-20 bg-white/90 backdrop-blur-md border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="p-3 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 rounded-xl transition-all duration-300 hover:scale-105 shadow-md"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ProctoVerse
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
            </div>
            
            {/* User Profile & Credits */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl px-6 py-3 border border-blue-200/50 shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-gray-700 font-bold text-lg">{getTotalCredits()}</span>
                    <span className="text-gray-600 text-sm ml-1">Credits</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/80 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm border border-white/50">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div>
                  <span className="text-gray-800 font-semibold">Revati</span>
                  <div className="text-xs text-gray-500">Level {currentLevel + 1}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-gray-700 text-sm font-semibold mb-8 backdrop-blur-sm border border-blue-200/50 shadow-lg">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            🤖 AI-Powered Professional Development Journey
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Welcome to Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Learning Adventure
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            🚀 Master interview skills through AI-guided training, real-time feedback, and personalized learning paths
          </p>

          {/* Enhanced feature highlights */}
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            <div className="flex items-center space-x-2 text-gray-600 bg-white/70 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50 shadow-md">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">AI Mentor</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 bg-white/70 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50 shadow-md">
              <Users className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium">Mock Interviews</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 bg-white/70 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50 shadow-md">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-medium">Smart Analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 bg-white/70 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50 shadow-md">
              <Star className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Skill Assessment</span>
            </div>
          </div>

          {/* Progress Stats with Credits Display */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto shadow-xl border-4 border-white/50">
                {completedLevels.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Levels Complete</div>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto shadow-xl border-4 border-white/50">
                {Math.round((completedLevels.length / 5) * 100)}%
              </div>
              <div className="text-sm text-gray-600 font-medium">Progress</div>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto shadow-xl border-4 border-white/50">
                <Trophy className="w-10 h-10" />
              </div>
              <div className="text-sm text-gray-600 font-medium">{getTotalCredits()} Credits</div>
            </div>
          </div>

          {/* Credits Breakdown */}
          {completedLevels.length > 0 && (
            <div className="mt-8 bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-xl max-w-2xl mx-auto">
              <h3 className="text-gray-800 font-bold text-lg mb-6 flex items-center justify-center">
                <Award className="w-6 h-6 mr-2 text-yellow-500" />
                Credits Earned
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {completedLevels.map((level) => (
                  <div key={level} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 border border-blue-200/50">
                    <span className="text-gray-600 text-sm font-medium">Level {level + 1}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-800 font-bold">{levelCredits[level as keyof typeof levelCredits]}</span>
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

        {/* Enhanced bottom section */}
        <div className="text-center mt-16 pb-12">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🌟 Join Thousands of Successful Professionals
            </h3>
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Trusted by Top Companies</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>95% Success Rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
