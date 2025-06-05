
import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, Target, Zap, Star, Trophy, User, GraduationCap, Award } from 'lucide-react';

interface RoadmapStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  status: 'completed' | 'current' | 'available' | 'locked';
}

interface InteractiveRoadmapProps {
  currentLevel: number;
  completedLevels: number[];
  onStepClick: (index: number) => void;
  levelCredits: { [key: number]: number };
}

const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({
  currentLevel,
  completedLevels,
  onStepClick,
  levelCredits
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const roadmapSteps: RoadmapStep[] = [
    {
      id: 0,
      title: "Skill Assessment",
      subtitle: "Level 1",
      description: "AI-powered evaluation of your current strengths and career growth areas",
      icon: "target",
      status: 'available'
    },
    {
      id: 1,
      title: "AI Mentor Chat",
      subtitle: "Level 2", 
      description: "Get personalized feedback and guidance from our AI career mentor",
      icon: "user",
      status: 'available'
    },
    {
      id: 2,
      title: "Pitch Builder",
      subtitle: "Level 3", 
      description: "Craft your personal pitch with AI-guided presentation skills",
      icon: "graduation-cap",
      status: 'available'
    },
    {
      id: 3,
      title: "Proctored Interview",
      subtitle: "Level 4",
      description: "Hands-on exercises and real-world scenario simulations with AI monitoring",
      icon: "star",
      status: 'available'
    },
    {
      id: 4,
      title: "Gamethon",
      subtitle: "Level 5",
      description: "Compete and rank up against other professionals in exciting challenges",
      icon: "trophy",
      status: 'available'
    }
  ];

  const getStepStatus = (index: number) => {
    if (completedLevels.includes(index)) return 'completed';
    if (index === currentLevel) return 'current';
    return 'available';
  };

  const getStepIcon = (step: RoadmapStep, status: string) => {
    if (status === 'completed') return <CheckCircle className="w-6 h-6 text-white" />;
    if (status === 'locked') return <Lock className="w-6 h-6 text-gray-400" />;
    
    const iconProps = "w-6 h-6 text-white";
    switch (step.icon) {
      case 'target': return <Target className={iconProps} />;
      case 'user': return <User className={iconProps} />;
      case 'graduation-cap': return <GraduationCap className={iconProps} />;
      case 'star': return <Star className={iconProps} />;
      case 'zap': return <Zap className={iconProps} />;
      case 'trophy': return <Trophy className={iconProps} />;
      default: return <Circle className={iconProps} />;
    }
  };

  const getStatusStyles = (status: string, isHovered: boolean) => {
    const baseClasses = 'transition-all duration-500 border-2 shadow-xl';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-green-200`;
      case 'current':
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 ring-4 ring-blue-200 animate-pulse`;
      case 'available':
        return `${baseClasses} bg-gradient-to-br from-purple-400 to-indigo-500 border-purple-300 ${isHovered ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-200' : 'shadow-purple-100'}`;
      default:
        return `${baseClasses} bg-gradient-to-br from-gray-300 to-gray-400 border-gray-200`;
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'completed': return 100;
      case 'current': return 75;
      default: return 0;
    }
  };

  return (
    <div className="py-12">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full text-gray-700 text-sm font-semibold mb-6 backdrop-blur-sm border border-purple-200/50 shadow-lg">
          🎯 Learning Roadmap
        </div>
        <h3 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Your Learning</span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Journey</span>
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Progress through each level to unlock advanced features and build your professional expertise</p>
      </div>

      {/* Single Line Roadmap */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Roadmap Container */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 rounded-full mx-16"></div>
          
          {/* Cards in Single Row */}
          <div className="flex justify-between items-start space-x-4 relative z-10">
            {roadmapSteps.map((step, index) => {
              const status = getStepStatus(index);
              const isClickable = status === 'current' || status === 'available' || status === 'completed';
              const isHovered = hoveredStep === index;
              const progress = getProgressPercentage(status);
              const credits = levelCredits[index] || 0;

              return (
                <div
                  key={step.id}
                  className="flex-1 relative max-w-xs"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <div
                    onClick={() => isClickable && onStepClick(index)}
                    className={`
                      relative p-6 rounded-3xl cursor-pointer transform transition-all duration-500
                      ${isClickable ? 'hover:scale-105 hover:-translate-y-3' : 'cursor-not-allowed opacity-75'}
                      ${isHovered ? 'shadow-2xl' : 'shadow-xl'}
                      bg-white/90 border-2 border-white/50 backdrop-blur-sm
                      hover:bg-white/95 hover:border-white/70
                    `}
                  >
                    {/* Floating particles for completed levels */}
                    {status === 'completed' && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                        <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-floating-particle-1"></div>
                        <div className="absolute top-6 right-5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-floating-particle-2"></div>
                        <div className="absolute bottom-5 left-6 w-1.5 h-1.5 bg-green-500 rounded-full animate-floating-particle-3"></div>
                      </div>
                    )}

                    {/* Level Badge */}
                    <div className="absolute -top-4 -left-4 z-10">
                      <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-xl transform transition-all duration-300
                        ${getStatusStyles(status, isHovered)}
                        ${isHovered ? 'scale-110' : ''}
                      `}>
                        {getStepIcon(step, status)}
                      </div>
                    </div>

                    {/* Credits Badge */}
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl px-3 py-2 flex items-center space-x-1 shadow-lg border-2 border-white">
                        <Award className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-bold">{credits}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {status === 'completed' && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="pt-8">
                      <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3 bg-purple-50 px-3 py-1 rounded-full inline-block">
                        {step.subtitle}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4 min-h-[2.5rem]">
                        {step.description}
                      </p>

                      {/* Enhanced Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span className="font-medium">Progress</span>
                          <span className="font-bold">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 relative overflow-hidden ${
                              status === 'completed' 
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                                : status === 'current'
                                  ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                                  : 'bg-gray-300'
                            }`}
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Action Button */}
                      <button
                        className={`
                          w-full py-3 px-4 rounded-2xl font-bold text-xs transition-all duration-300 transform shadow-lg
                          ${status === 'completed'
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300 border-2 border-green-300' 
                            : status === 'current'
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-blue-200 border-2 border-blue-400'
                              : status === 'available'
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-purple-200 border-2 border-purple-400'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-400'
                          }
                          ${isHovered && isClickable ? 'scale-105 shadow-xl' : ''}
                        `}
                        disabled={!isClickable}
                      >
                        {status === 'completed' ? '✅ Review' : 
                         status === 'current' ? '🚀 Continue' : 
                         status === 'available' ? '▶️ Begin' : '🔒 Locked'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Progress Summary */}
        <div className="mt-16 bg-white/90 backdrop-blur-md rounded-3xl p-8 border-2 border-white/50 shadow-2xl transform transition-all duration-500 hover:scale-105">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-800">Learning Progress</h4>
                <p className="text-sm text-gray-600">Your journey to interview mastery</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">{completedLevels.length}/5</div>
              <div className="text-sm text-gray-600 font-medium">Completed</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-400 to-indigo-500 h-4 rounded-full transition-all duration-1000 relative overflow-hidden shadow-lg"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer" />
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mt-3 font-medium">
            <span>Journey Progress</span>
            <span>{Math.round((completedLevels.length / roadmapSteps.length) * 100)}% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
