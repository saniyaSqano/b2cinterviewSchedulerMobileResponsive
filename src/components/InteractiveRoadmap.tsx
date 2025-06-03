
import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, Target, Zap, Star, Trophy, User, GraduationCap } from 'lucide-react';

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
}

const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({
  currentLevel,
  completedLevels,
  onStepClick
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
      title: "Practice Hub",
      subtitle: "Level 4",
      description: "Hands-on exercises and real-world scenario simulations",
      icon: "star",
      status: 'available'
    },
    {
      id: 4,
      title: "Proctored Interview",
      subtitle: "Level 5",
      description: "Simulated environment with comprehensive AI-powered analysis",
      icon: "zap",
      status: 'available'
    },
    {
      id: 5,
      title: "Leaderboard Challenge",
      subtitle: "Level 6",
      description: "Compete and rank up against other professionals",
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
    const baseClasses = 'transition-all duration-300 border-2 shadow-lg hover:shadow-xl';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-br from-purple-500 to-purple-600 border-purple-400`;
      case 'current':
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 ring-4 ring-blue-200`;
      case 'available':
        return `${baseClasses} bg-gradient-to-br from-gray-400 to-gray-500 border-gray-300 ${isHovered ? 'bg-gradient-to-br from-gray-500 to-gray-600' : ''}`;
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
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-purple-100/80 rounded-full text-purple-700 text-sm font-medium mb-4 backdrop-blur-sm">
          🎯 Learning Roadmap
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Journey</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">Progress through each level to unlock advanced features and build your professional expertise</p>
      </div>

      {/* Vertical Roadmap */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapSteps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = status === 'current' || status === 'available' || status === 'completed';
            const isHovered = hoveredStep === index;
            const progress = getProgressPercentage(status);

            return (
              <div
                key={step.id}
                className="relative"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div
                  onClick={() => isClickable && onStepClick(index)}
                  className={`
                    relative p-6 rounded-2xl cursor-pointer transform transition-all duration-300
                    ${isClickable ? 'hover:scale-105 hover:-translate-y-1' : 'cursor-not-allowed opacity-75'}
                    ${isHovered ? 'shadow-2xl' : 'shadow-lg'}
                    bg-white border border-gray-200 backdrop-blur-sm
                  `}
                >
                  {/* Level Badge */}
                  <div className="absolute -top-3 -left-3 z-10">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg
                      ${getStatusStyles(status, isHovered)}
                    `}>
                      {getStepIcon(step, status)}
                    </div>
                  </div>

                  {/* Status Badge */}
                  {status === 'completed' && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="pt-6">
                    <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">
                      {step.subtitle}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            status === 'completed' 
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                              : status === 'current'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                : 'bg-gray-300'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className={`
                        w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300
                        ${status === 'completed'
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                          : status === 'current'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : status === 'available'
                              ? 'bg-gray-600 text-white hover:bg-gray-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}
                      disabled={!isClickable}
                    >
                      {status === 'completed' ? 'Review Level' : 
                       status === 'current' ? 'Continue' : 
                       status === 'available' ? 'Begin Level' : 'Locked'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall Progress Summary */}
        <div className="mt-12 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Learning Progress</h4>
                <p className="text-sm text-gray-600">Your journey to interview mastery</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{completedLevels.length}/6</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>33% Journey Complete</span>
            <span>{Math.round((completedLevels.length / roadmapSteps.length) * 100)}% Overall Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
