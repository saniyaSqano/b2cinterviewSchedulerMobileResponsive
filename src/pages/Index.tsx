
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Top Navigation Bar */}
      <div className="relative z-20 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Proctoverse
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
              <span className="hover:text-gray-900 cursor-pointer">Progress</span>
              <span className="hover:text-gray-900 cursor-pointer">Resources</span>
              <span className="hover:text-gray-900 cursor-pointer">Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100/80 rounded-full text-purple-700 text-sm font-medium mb-6 backdrop-blur-sm">
            🤖 AI-Powered Professional Development
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Proctoverse</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your AI-guided journey to interview mastery through intelligent learning and personalized feedback
          </p>

          {/* Progress Stats */}
          <div className="flex items-center justify-center space-x-8 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto">
                {completedLevels.length}
              </div>
              <div className="text-sm text-gray-500">Levels Complete</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto">
                {Math.round((completedLevels.length / 6) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Overall Progress</div>
            </div>
          </div>
        </div>

        {/* Interactive Roadmap */}
        <div className="max-w-7xl mx-auto px-6">
          <InteractiveRoadmap
            currentLevel={currentLevel}
            completedLevels={completedLevels}
            onStepClick={handleCardClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
