
import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, Target, Zap, Star, Trophy, User, GraduationCap, Award, ArrowRight } from 'lucide-react';
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

  const roadmapSteps: RoadmapStep[] = [
    {
      id: 0,
      title: "Skill Assessment",
      subtitle: "Foundation Level",
      description: "AI-powered evaluation of your current strengths and career growth areas",
      icon: "target",
      status: 'available'
    },
    {
      id: 1,
      title: "AI Mentor Chat",
      subtitle: "Guidance Level", 
      description: "Get personalized feedback and guidance from our AI career mentor",
      icon: "user",
      status: 'available'
    },
    {
      id: 2,
      title: "Pitch Builder",
      subtitle: "Presentation Level", 
      description: "Craft your personal pitch with AI-guided presentation skills",
      icon: "graduation-cap",
      status: 'available'
    },
    {
      id: 3,
      title: "Proctored Interview",
      subtitle: "Advanced Level",
      description: "Hands-on exercises and real-world scenario simulations with AI monitoring",
      icon: "star",
      status: 'available'
    },
    {
      id: 4,
      title: "Gamethon",
      subtitle: "Expert Level",
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
    if (status === 'completed') return <CheckCircle className="w-8 h-8 text-white" />;
    if (status === 'locked') return <Lock className="w-8 h-8 text-gray-400" />;
    
    const iconProps = "w-8 h-8 text-white";
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
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-green-500/25';
      case 'current':
        return 'bg-gradient-to-br from-blue-500 to-cyan-600 border-blue-400 shadow-blue-500/25 ring-2 ring-blue-400/50';
      case 'available':
        return `bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-400 shadow-purple-500/25 ${isHovered ? 'scale-105 shadow-purple-500/40' : ''}`;
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500 border-gray-300 shadow-gray-500/25';
    }
  };

  return (
    <div className="py-8">
      {/* Overall Progress */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-white">Learning Progress</h4>
                <p className="text-sm text-blue-200">Your roadmap to professional mastery</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{completedLevels.length}/5</div>
              <div className="text-sm text-blue-200 font-medium">Modules Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-blue-200 mt-3 font-medium">
            <span>Journey Progress</span>
            <span>{Math.round((completedLevels.length / roadmapSteps.length) * 100)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative">
          {/* Connection Lines */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {roadmapSteps.map((step, index) => {
              const status = getStepStatus(index);
              const isHovered = hoveredStep === index;
              const credits = levelCredits[index] || 0;

              return (
                <div
                  key={step.id}
                  className="relative"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Connector Arrow (Desktop only) */}
                  {index < roadmapSteps.length - 1 && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 hidden lg:block">
                      <ArrowRight className="w-6 h-6 text-white/40" />
                    </div>
                  )}

                  <div
                    onClick={() => onStepClick(index)}
                    className={`
                      relative p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 
                      hover:bg-white/15 hover:-translate-y-2 transition-all duration-300 cursor-pointer
                      h-full flex flex-col justify-between group
                      ${isHovered ? 'shadow-2xl' : 'shadow-xl'}
                    `}
                  >
                    {/* Status Badge */}
                    {status === 'completed' && (
                      <div className="absolute -top-3 -right-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Credits Badge */}
                    <div className="absolute -top-3 -left-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl px-3 py-1.5 flex items-center space-x-1 shadow-lg border border-white/30">
                        <Award className="w-3.5 h-3.5 text-white" />
                        <span className="text-white text-sm font-bold">{credits}</span>
                      </div>
                    </div>

                    {/* Icon Section */}
                    <div className="flex justify-center mb-6 mt-4">
                      <div className={`
                        w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all duration-300
                        ${getStatusStyles(status, isHovered)}
                      `}>
                        {getStepIcon(step, status)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-3 flex-1 flex flex-col justify-center">
                      <div className="text-xs font-bold text-blue-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full inline-block mx-auto">
                        {step.subtitle}
                      </div>
                      
                      <h4 className="text-xl font-bold text-white leading-tight">
                        {step.title}
                      </h4>
                      
                      <p className="text-sm text-blue-100 leading-relaxed min-h-[60px] flex items-center justify-center px-2">
                        {step.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-blue-200">
                        <span className="font-medium">Status</span>
                        <span className="font-bold capitalize">{status}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            status === 'completed' 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-full' 
                              : status === 'current'
                                ? 'bg-gradient-to-r from-blue-400 to-cyan-500 w-3/4'
                                : 'bg-white/30 w-0'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <button
                        className={`
                          w-full py-3 px-4 rounded-2xl font-bold text-sm shadow-lg border-2 transition-all duration-300
                          ${status === 'completed'
                            ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-200 hover:from-green-500/30 hover:to-green-600/30 border-green-400/50' 
                            : status === 'current'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 border-blue-400'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 border-purple-400'
                          }
                          group-hover:scale-105
                        `}
                      >
                        {status === 'completed' ? '✅ Review' : 
                         status === 'current' ? '🚀 Continue' : 
                         '▶️ Start Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
