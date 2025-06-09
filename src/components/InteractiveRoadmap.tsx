
import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, Target, Zap, Star, Trophy, User, GraduationCap, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
    const baseClasses = 'transition-all duration-300 border-2 shadow-lg';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-br from-green-500 to-emerald-600 border-green-400`;
      case 'current':
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 ring-2 ring-blue-200`;
      case 'available':
        return `${baseClasses} bg-gradient-to-br from-purple-400 to-indigo-500 border-purple-300 ${isHovered ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : ''}`;
      default:
        return `${baseClasses} bg-gradient-to-br from-gray-300 to-gray-400 border-gray-200`;
    }
  };

  const getProgressPercentage = (status: string, index: number) => {
    if (status === 'completed') return 100;
    if (index === 0 && status === 'current') return 75; // Special case for level 1
    if (status === 'current') return 0;
    return 0;
  };

  const handleCardClick = (index: number) => {
    navigate('/user-info');
  };

  return (
    <div className="py-12">
      {/* Overall Progress Summary */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border-2 border-white/50 shadow-xl">
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
              className="bg-gradient-to-r from-purple-400 to-indigo-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mt-3 font-medium">
            <span>Journey Progress</span>
            <span>{Math.round((completedLevels.length / roadmapSteps.length) * 100)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Roadmap Cards */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {roadmapSteps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = true; // All cards are clickable now
            const isHovered = hoveredStep === index;
            const progress = getProgressPercentage(status, index);
            const credits = levelCredits[index] || 0;

            return (
              <div
                key={step.id}
                className="relative"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div
                  onClick={() => handleCardClick(index)}
                  className={`
                    relative p-6 rounded-3xl transition-all duration-300 shadow-xl bg-white border-2 border-gray-100 backdrop-blur-sm cursor-pointer hover:shadow-2xl hover:border-gray-200 hover:-translate-y-1
                  `}
                >
                  {/* Level Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-xl transition-all duration-300
                      ${getStatusStyles(status, isHovered)}
                    `}>
                      {getStepIcon(step, status)}
                    </div>
                  </div>

                  {/* Credits Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl px-3 py-2 flex items-center space-x-1 shadow-lg border-2 border-white">
                      <Award className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-bold">{credits}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {status === 'completed' && (
                    <div className="absolute top-4 left-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="text-center">
                    <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3 bg-purple-50 px-3 py-1 rounded-full inline-block">
                      {step.subtitle}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 min-h-[3rem]">
                      {step.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            status === 'completed' 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                              : status === 'current' && index === 0
                                ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                                : 'bg-gray-300'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className={`
                        w-full py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg border-2
                        ${status === 'completed'
                          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300 border-green-300' 
                          : status === 'current'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 border-blue-400'
                            : status === 'available'
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 border-purple-400'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                        }
                        ${isHovered ? 'transform scale-105' : ''}
                      `}
                    >
                      {status === 'completed' ? '✅ Continue' : 
                       status === 'current' && index === 0 ? '🚀 Continue' : 
                       status === 'available' ? '▶️ Begin' : '🔒 Locked'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
