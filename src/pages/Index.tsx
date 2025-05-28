import React, { useState } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
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
      description: "Evaluate your current skills and knowledge with our comprehensive assessment to identify areas for improvement and growth.",
      icon: "graduation-cap" as const,
    },
    {
      id: 1,
      title: "AI Chat Session",
      subtitle: "Level 2",
      description: "Engage with our AI assistant for personalized feedback, guidance, and insights based on your assessment results.",
      icon: "user" as const,
    },
    {
      id: 2,
      title: "Pitch Yourself",
      subtitle: "Level 3",
      description: "Learn to create compelling personal pitches and develop your professional presentation skills with interactive practice.",
      icon: "graduation-cap" as const,
    },
    {
      id: 3,
      title: "Self Practice",
      subtitle: "Level 4",
      description: "Practice your skills with hands-on exercises and real-world scenarios designed to reinforce your learning.",
      icon: "user" as const,
    },
    {
      id: 4,
      title: "AI Proctored Interview",
      subtitle: "Level 5",
      description: "Demonstrate your newly acquired skills in a realistic AI-proctored interview environment with real-time feedback.",
      icon: "graduation-cap" as const,
    },
    {
      id: 5,
      title: "GameOn Competition",
      subtitle: "Level 6",
      description: "Compete with others and showcase your skills in gamified challenges and competitions to earn recognition.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 text-center py-8">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Professional Development Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Follow your personalized learning path through comprehensive skill assessment and development
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 py-4">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">Learning Progress</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {completedLevels.length} of {learningSteps.length} completed
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-slate-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedLevels.length / learningSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Horizontal Timeline */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="relative">
            {/* Desktop: Horizontal Layout with smaller cards */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between space-x-2">
                {learningSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    {/* Card with Step Number - made smaller */}
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 z-20">
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
                          ${completedLevels.includes(index)
                            ? 'bg-slate-600 text-white' 
                            : index === currentLevel 
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-300 text-slate-600'
                          }
                        `}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="w-52"> {/* Reduced from w-80 to w-52 */}
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
                    </div>
                    
                    {/* Arrow between cards (except after last card) */}
                    {index < learningSteps.length - 1 && (
                      <div className="flex items-center justify-center mx-2"> {/* Reduced margin */}
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 shadow-lg
                          ${completedLevels.includes(index)
                            ? 'bg-slate-600 text-white' 
                            : 'bg-slate-300 text-slate-500'
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

            {/* Tablet: 2 rows of 3 cards */}
            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-3 gap-6"> {/* Reduced gap */}
                {learningSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div className="absolute -top-2 -left-2 z-20">
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
                        ${completedLevels.includes(index)
                          ? 'bg-slate-600 text-white' 
                          : index === currentLevel 
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-300 text-slate-600'
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
                ))}
              </div>
            </div>

            {/* Mobile: Single column */}
            <div className="md:hidden space-y-6"> {/* Reduced spacing */}
              {learningSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  <div className="absolute -top-2 -left-2 z-20">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
                      ${completedLevels.includes(index)
                        ? 'bg-slate-600 text-white' 
                        : index === currentLevel 
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-300 text-slate-600'
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
                  
                  {/* Vertical arrow for mobile */}
                  {index < learningSteps.length - 1 && (
                    <div className="flex justify-center my-3">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 shadow-md
                        ${completedLevels.includes(index)
                          ? 'bg-slate-600 text-white' 
                          : 'bg-slate-300 text-slate-500'
                        }
                      `}>
                        <ArrowDown className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 py-8">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to advance your career?</h3>
            <p className="text-slate-600">
              Complete each level to unlock the next stage of your professional development journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
