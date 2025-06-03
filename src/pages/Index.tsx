
import React, { useState } from 'react';
import { ArrowRight, Sparkles, Target, Zap } from 'lucide-react';
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Enhanced animated background with light theme */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 via-cyan-200/15 to-indigo-200/20 rounded-full blur-3xl animate-pulse opacity-70" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-cyan-200/15 via-blue-200/20 to-indigo-200/15 rounded-full blur-2xl animate-pulse opacity-60" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-200/15 via-cyan-200/20 to-blue-200/15 rounded-full blur-3xl animate-pulse opacity-50" style={{ animationDelay: '4s', animationDuration: '10s' }}></div>
        
        {/* Animated tech elements */}
        <div className="absolute top-16 right-1/4 w-24 h-24 border-2 border-blue-300/20 rounded-lg animate-spin opacity-30" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 left-1/5 w-20 h-20 border-2 border-cyan-300/25 rounded-full animate-spin opacity-40" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-blue-200/20 transform rotate-45 animate-pulse opacity-25" style={{ animationDuration: '3s' }}></div>
        
        {/* Animated gradient lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent animate-pulse opacity-60" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent animate-pulse opacity-50" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        
        {/* Floating icons */}
        <div className="absolute top-1/6 left-1/6 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
          <Sparkles className="w-8 h-8 text-blue-300/40" />
        </div>
        <div className="absolute bottom-1/4 right-1/5 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}>
          <Target className="w-6 h-6 text-cyan-300/40" />
        </div>
        <div className="absolute top-1/3 left-3/4 animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
          <Zap className="w-7 h-7 text-indigo-300/40" />
        </div>
        
        {/* Floating tech particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-bounce opacity-70"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + Math.random() * 1.5}s`
            }}
          />
        ))}
      </div>
      
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen">
        {/* Enhanced header with light theme */}
        <div className="bg-gradient-to-r from-white/95 via-blue-50/90 to-white/95 backdrop-blur-lg border-b border-blue-200/30 text-center py-12 relative overflow-hidden">
          {/* Header background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent animate-pulse" style={{ animationDuration: '3s' }}></div>
          
          <div className="max-w-4xl mx-auto px-6 relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in relative">
              Proctoverse
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-indigo-400/20 blur-xl -z-10 animate-pulse"></div>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in font-light" style={{ animationDelay: '0.3s' }}>
              Experience the future of skill assessment through AI-powered learning paths and intelligent evaluation systems
            </p>
            
            {/* AI badge */}
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 rounded-full border border-blue-300/30 animate-fade-in backdrop-blur-sm" style={{ animationDelay: '0.6s' }}>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-blue-700 text-sm font-medium">AI-Powered Platform</span>
            </div>
          </div>
        </div>

        {/* Enhanced progress bar with light theme */}
        <div className="bg-gradient-to-r from-white/90 via-blue-50/85 to-white/90 backdrop-blur-md border-b border-blue-200/20 py-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-blue-700 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                Learning Progress
              </span>
              <span className="text-sm font-medium text-gray-700 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 px-4 py-2 rounded-full border border-blue-300/30 animate-fade-in backdrop-blur-sm">
                {completedLevels.length} of {learningSteps.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-blue-200/20">
              <div
                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 animate-fade-in relative overflow-hidden"
                style={{ width: `${(completedLevels.length / learningSteps.length) * 100}%` }}
              >
                {/* Progress bar glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced horizontal timeline with light theme */}
        <div className="max-w-6xl mx-auto px-4 py-12 relative">
          {/* Background tech grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 grid-rows-8 gap-4 h-full">
              {Array.from({ length: 96 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-blue-300/20 rounded animate-pulse"
                  style={{ animationDelay: `${(i % 12) * 0.1}s`, animationDuration: '3s' }}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 relative">
            {learningSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Enhanced card with step number */}
                <div className="relative animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                  {/* Glowing background for active/completed cards */}
                  {(completedLevels.includes(index) || index === currentLevel) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-xl blur-lg animate-pulse" style={{ transform: 'scale(1.1)' }}></div>
                  )}
                  
                  <div className="absolute -top-3 -left-3 z-20">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-2xl border-2 transition-all duration-500 hover:scale-125 relative overflow-hidden
                      ${completedLevels.includes(index)
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-400 animate-pulse' 
                        : index === currentLevel 
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400 animate-pulse'
                          : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 border-gray-300'
                      }
                    `}>
                      {index + 1}
                      {/* Number glow effect */}
                      {(completedLevels.includes(index) || index === currentLevel) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-pulse"></div>
                      )}
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
                
                {/* Enhanced arrow with light theme */}
                {index < learningSteps.length - 1 && (
                  <div className="flex items-center justify-center mx-3">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 hover:scale-125 relative overflow-hidden border-2
                      ${completedLevels.includes(index)
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-400 text-white shadow-lg animate-pulse' 
                        : 'bg-gradient-to-r from-gray-200 to-gray-300 border-gray-300 text-gray-500'
                      }
                    `}>
                      <ArrowRight className="w-5 h-5 relative z-10" />
                      {/* Arrow glow effect */}
                      {completedLevels.includes(index) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced bottom section with light theme */}
        <div className="bg-gradient-to-r from-white/95 via-blue-50/90 to-white/95 backdrop-blur-lg border-t border-blue-200/30 py-12 relative overflow-hidden">
          {/* Background tech pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-10 w-32 h-32 border border-blue-300/30 rounded-lg animate-spin" style={{ animationDuration: '30s' }}></div>
            <div className="absolute bottom-4 right-10 w-24 h-24 border border-cyan-300/30 rounded-full animate-pulse"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-fade-in">
              Ready to Transform Your Career?
            </h3>
            <p className="text-lg text-gray-600 animate-fade-in leading-relaxed max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Embark on an AI-guided journey through cutting-edge assessment technologies and personalized skill development pathways
            </p>
            
            {/* Tech indicators */}
            <div className="mt-8 flex justify-center space-x-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {['AI Analysis', 'Real-time Feedback', 'Skill Tracking'].map((feature, i) => (
                <div key={feature} className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" style={{ animationDelay: `${i * 0.3}s` }}></div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
