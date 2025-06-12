import React, { useState } from 'react';
import { Trophy, Star, Award, Brain, Users, Sparkles, CheckCircle, Clock, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background with Particles */}
      <ParticleBackground />
      
      {/* Header Section */}

        {/* Roadmap Section */}
        <InteractiveRoadmap
          currentLevel={currentLevel}
          completedLevels={completedLevels}
          onStepClick={handleCardClick}
          levelCredits={levelCredits}
        />

        {/* Achievement Section */}
        {completedLevels.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 mt-16">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-blue-200/50 shadow-lg">
              <h3 className="text-slate-800 font-bold text-xl mb-6 flex items-center justify-center">
                <Award className="w-6 h-6 mr-2 text-blue-500" />
                Achievement Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {completedLevels.map((level) => (
                  <div key={level} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 border border-blue-200/50">
                    <span className="text-slate-600 text-sm font-medium">Module {level + 1}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span className="text-slate-800 font-bold">{levelCredits[level as keyof typeof levelCredits]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-20 pb-16">
          <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-12 border border-blue-200/50 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4 animate-spin-slow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-slate-800">Continue Your Journey</h3>
                <p className="text-slate-600">Unlock your potential with AI-powered learning</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="font-semibold text-slate-800 mb-1">Certified Training</div>
                <div className="text-sm text-slate-600">Industry-recognized certifications</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 animate-bounce-subtle">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div className="font-semibold text-slate-800 mb-1">AI-Powered Learning</div>
                <div className="text-sm text-slate-600">Personalized feedback and guidance</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3 animate-wiggle">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="font-semibold text-slate-800 mb-1">Career Growth</div>
                <div className="text-sm text-slate-600">Proven results and outcomes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelsContent;
