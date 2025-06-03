
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import AssessmentFlow from '../components/AssessmentFlow';
import ChatFlow from '../components/ChatFlow';
import Level3Flow from '../components/Level3Flow';
import Level4Flow from '../components/Level4Flow';
import Level5Flow from '../components/Level5Flow';
import LearningCard from '../components/LearningCard';

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLevel3, setShowLevel3] = useState(false);
  const [showLevel4, setShowLevel4] = useState(false);
  const [showLevel5, setShowLevel5] = useState(false);
  const [assessmentScore] = useState(70);

  const learningSteps = [
    {
      id: 0,
      title: "Skill Assessment",
      subtitle: "Level 1",
      description: "Evaluate your current skills and knowledge with our comprehensive assessment.",
      icon: "graduation-cap" as const,
    },
    {
      id: 1,
      title: "AI Chat Session",
      subtitle: "Level 2",
      description: "Engage with our AI assistant for personalized feedback and guidance.",
      icon: "user" as const,
    },
    {
      id: 2,
      title: "Pitch Yourself",
      subtitle: "Level 3",
      description: "Learn to create compelling personal pitches and presentation skills.",
      icon: "graduation-cap" as const,
    },
    {
      id: 3,
      title: "Self Practice",
      subtitle: "Level 4",
      description: "Practice your skills with hands-on exercises and real-world scenarios.",
      icon: "user" as const,
    },
    {
      id: 4,
      title: "AI Proctored Interview",
      subtitle: "Level 5",
      description: "Demonstrate your skills in a realistic AI-proctored interview environment.",
      icon: "graduation-cap" as const,
    },
    {
      id: 5,
      title: "GameOn Competition",
      subtitle: "Level 6",
      description: "Compete with others and showcase your skills in gamified challenges.",
      icon: "user" as const,
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-purple-300/20 to-blue-300/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Animated gradient lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-indigo-400/40 rounded-full animate-bounce" style={{ animationDelay: '2.1s' }}></div>
        
        {/* Rotating geometric shapes */}
        <div className="absolute top-16 right-1/4 w-16 h-16 border border-purple-300/30 rounded-lg animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 left-1/5 w-12 h-12 border border-blue-300/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
      </div>
      
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-purple-100 text-center py-8">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight animate-fade-in">
              Proctoverse
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Follow your personalized learning path through comprehensive skill assessment and development
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-purple-100 py-4">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-purple-700">Learning Progress</span>
              <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full animate-fade-in">
                {completedLevels.length} of {learningSteps.length} completed
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-700 animate-fade-in"
                style={{ width: `${(completedLevels.length / learningSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Horizontal Timeline */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-3">
            {learningSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Card with Step Number */}
                <div className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="absolute -top-2 -left-2 z-20">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white transition-all duration-300 hover:scale-110
                      ${completedLevels.includes(index)
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white animate-pulse' 
                        : index === currentLevel 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white animate-pulse'
                          : 'bg-gray-300 text-gray-600'
                      }
                    `}>
                      {index + 1}
                    </div>
                  </div>
                  <LearningCard
                    title={step.title}
                    subtitle={step.subtitle}
                    description={step.description}
                    icon={step.icon}
                    isCompleted={completedLevels.includes(index)}
                    isActive={index === currentLevel}
                    onClick={() => handleCardClick(index)}
                  />
                </div>
                
                {/* Arrow between cards */}
                {index < learningSteps.length - 1 && (
                  <div className="flex items-center justify-center mx-2">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:scale-110
                      ${completedLevels.includes(index)
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-md animate-pulse' 
                        : 'bg-purple-200 text-purple-400'
                      }
                    `}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-purple-100 py-8">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 animate-fade-in">
              Ready to advance your career?
            </h3>
            <p className="text-base text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Complete each level to unlock the next stage of your professional development journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
