import React, { useState } from 'react';
import { ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';
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

        {/* Cards Grid with Custom Arrow Pattern */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="relative">
            {/* Grid Container - First row: cards 1,2 - Second row: cards 3,4 - Third row: cards 5,6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {/* Row 1: Cards 1 and 2 */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 z-20">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
                    ${completedLevels.includes(0)
                      ? 'bg-slate-600 text-white' 
                      : 0 === currentLevel 
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }
                  `}>
                    1
                  </div>
                </div>
                <LearningCard
                  title={learningSteps[0].title}
                  subtitle={learningSteps[0].subtitle}
                  description={learningSteps[0].description}
                  icon={learningSteps[0].icon}
                  isCompleted={completedLevels.includes(0)}
                  isActive={0 === currentLevel}
                  onClick={() => handleCardClick(0)}
                />
              </div>

              <div className="relative">
                <div className="absolute -top-3 -left-3 z-20">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
                    ${completedLevels.includes(1)
                      ? 'bg-slate-600 text-white' 
                      : 1 === currentLevel 
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }
                  `}>
                    2
                  </div>
                </div>
                <LearningCard
                  title={learningSteps[1].title}
                  subtitle={learningSteps[1].subtitle}
                  description={learningSteps[1].description}
                  icon={learningSteps[1].icon}
                  isCompleted={completedLevels.includes(1)}
                  isActive={1 === currentLevel}
                  onClick={() => handleCardClick(1)}
                />
              </div>

              {/* Row 2: Cards 3 and 4 */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 z-20">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
                    ${completedLevels.includes(2)
                      ? 'bg-slate-600 text-white' 
                      : 2 === currentLevel 
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }
                  `}>
                    3
                  </div>
                </div>
                <LearningCard
                  title={learningSteps[2].title}
                  subtitle={learningSteps[2].subtitle}
                  description={learningSteps[2].description}
                  icon={learningSteps[2].icon}
                  isCompleted={completedLevels.includes(2)}
                  isActive={2 === currentLevel}
                  onClick={() => handleCardClick(2)}
                />
              </div>

              <div className="relative">
                <div className="absolute -top-3 -left-3 z-20">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
                    ${completedLevels.includes(3)
                      ? 'bg-slate-600 text-white' 
                      : 3 === currentLevel 
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }
                  `}>
                    4
                  </div>
                </div>
                <LearningCard
                  title={learningSteps[3].title}
                  subtitle={learningSteps[3].subtitle}
                  description={learningSteps[3].description}
                  icon={learningSteps[3].icon}
                  isCompleted={completedLevels.includes(3)}
                  isActive={3 === currentLevel}
                  onClick={() => handleCardClick(3)}
                />
              </div>

              {/* Row 3: Cards 5 and 6 */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 z-20">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
                    ${completedLevels.includes(4)
                      ? 'bg-slate-600 text-white' 
                      : 4 === currentLevel 
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }
                  `}>
                    5
                  </div>
                </div>
                <LearningCard
                  title={learningSteps[4].title}
                  subtitle={learningSteps[4].subtitle}
                  description={learningSteps[4].description}
                  icon={learningSteps[4].icon}
                  isCompleted={completedLevels.includes(4)}
                  isActive={4 === currentLevel}
                  onClick={() => handleCardClick(4)}
                />
              </div>

              <div className="relative">
                <div className="absolute -top-3 -left-3 z-20">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
                    ${completedLevels.includes(5)
                      ? 'bg-slate-600 text-white' 
                      : 5 === currentLevel 
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }
                  `}>
                    6
                  </div>
                </div>
                <LearningCard
                  title={learningSteps[5].title}
                  subtitle={learningSteps[5].subtitle}
                  description={learningSteps[5].description}
                  icon={learningSteps[5].icon}
                  isCompleted={completedLevels.includes(5)}
                  isActive={5 === currentLevel}
                  onClick={() => handleCardClick(5)}
                />
              </div>
            </div>

            {/* Corrected Arrow Pattern: 1→2, 2↓3, 4←3, 4↓5, 5→6 */}
            
            {/* Arrow 1→2 (Right arrow between cards 1 and 2) */}
            <div className="hidden md:block absolute top-[12%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg
                ${completedLevels.includes(0)
                  ? 'bg-slate-600 text-white' 
                  : 'bg-slate-300 text-slate-500'
                }
              `}>
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Down arrow from AI Chat (2) to Pitch Yourself (3) */}
            <div className="hidden md:block absolute top-[29%] right-[25%] transform translate-x-1/2 z-10">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg
                ${completedLevels.includes(1)
                  ? 'bg-slate-600 text-white' 
                  : 'bg-slate-300 text-slate-500'
                }
              `}>
                <ArrowDown className="w-6 h-6" />
              </div>
            </div>

            {/* Arrow Self Practice (4) ← Pitch Yourself (3) - Left arrow from card 3 to card 4 */}
            <div className="hidden md:block absolute top-[46%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg
                ${completedLevels.includes(2)
                  ? 'bg-slate-600 text-white' 
                  : 'bg-slate-300 text-slate-500'
                }
              `}>
                <ArrowLeft className="w-6 h-6" />
              </div>
            </div>

            {/* Down arrow from Self Practice (4) to AI Proctored Interview (5) */}
            <div className="hidden md:block absolute top-[63%] left-[25%] transform -translate-x-1/2 z-10">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg
                ${completedLevels.includes(3)
                  ? 'bg-slate-600 text-white' 
                  : 'bg-slate-300 text-slate-500'
                }
              `}>
                <ArrowDown className="w-6 h-6" />
              </div>
            </div>

            {/* Arrow AI Proctored Interview (5) → GameOn Competition (6) */}
            <div className="hidden md:block absolute top-[80%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg
                ${completedLevels.includes(4)
                  ? 'bg-slate-600 text-white' 
                  : 'bg-slate-300 text-slate-500'
                }
              `}>
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Mobile arrows (vertical flow) */}
            <div className="md:hidden">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={`mobile-arrow-${index}`} className="absolute left-1/2 transform -translate-x-1/2 z-10" style={{
                  top: `${20 + (index * 16)}%`
                }}>
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-md
                    ${completedLevels.includes(index)
                      ? 'bg-slate-600 text-white' 
                      : 'bg-slate-300 text-slate-500'
                    }
                  `}>
                    <ArrowDown className="w-5 h-5" />
                  </div>
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
