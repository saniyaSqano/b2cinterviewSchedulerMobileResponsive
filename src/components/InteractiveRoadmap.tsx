
import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, Target, Zap, Star, Trophy, User, GraduationCap, Award, ArrowRight, Sparkles } from 'lucide-react';

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
        return 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-green-500/30';
      case 'current':
        return 'bg-gradient-to-br from-blue-500 to-cyan-600 border-blue-400 shadow-blue-500/30 ring-2 ring-blue-400/50 animate-pulse-glow';
      case 'available':
        return `bg-gradient-to-br from-indigo-500 to-blue-600 border-indigo-400 shadow-indigo-500/30 ${isHovered ? 'scale-105 shadow-indigo-500/50' : ''}`;
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500 border-gray-300 shadow-gray-500/30';
    }
  };

  return (
    <div className="py-8">
      {/* Overall Progress */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-blue-200/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-slate-800">Learning Progress</h4>
                <p className="text-sm text-slate-600">Your roadmap to professional mastery</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-800">{completedLevels.length}/5</div>
              <div className="text-sm text-slate-600 font-medium">Modules Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg animate-shimmer"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-slate-600 mt-3 font-medium">
            <span>Journey Progress</span>
            <span>{Math.round((completedLevels.length / roadmapSteps.length) * 100)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative">
          {/* Connection Lines with Animation */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent transform -translate-y-1/2 hidden lg:block animate-pulse" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {roadmapSteps.map((step, index) => {
              const status = getStepStatus(index);
              const isHovered = hoveredStep === index;
              const credits = levelCredits[index] || 0;

              return (
                <div
                  key={step.id}
                  className="relative animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Connector Arrow with Animation */}
                  {index < roadmapSteps.length - 1 && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 hidden lg:block animate-bounce-subtle">
                      <ArrowRight className="w-6 h-6 text-slate-400" />
                    </div>
                  )}

                  <div
                    onClick={() => onStepClick(index)}
                    className={`
                      relative p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/50 
                      hover:bg-white hover:-translate-y-3 transition-all duration-300 cursor-pointer
                      h-full flex flex-col justify-between group shadow-lg hover:shadow-2xl
                      ${isHovered ? 'scale-102' : ''}
                    `}
                  >
                    {/* Status Badge */}
                    {status === 'completed' && (
                      <div className="absolute -top-3 -right-3 animate-bounce">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Credits Badge with Animation */}
                    <div className="absolute -top-3 -left-3 animate-wiggle">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-3 py-1.5 flex items-center space-x-1 shadow-lg border border-white/50">
                        <Award className="w-3.5 h-3.5 text-white" />
                        <span className="text-white text-sm font-bold">{credits}</span>
                      </div>
                    </div>

                    {/* Icon Section with Enhanced Animation */}
                    <div className="flex justify-center mb-6 mt-4">
                      <div className={`
                        w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all duration-300
                        ${getStatusStyles(status, isHovered)}
                        ${status === 'current' ? 'animate-pulse-glow' : ''}
                        ${isHovered ? 'animate-bounce-subtle' : ''}
                      `}>
                        {getStepIcon(step, status)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-3 flex-1 flex flex-col justify-center">
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full inline-block mx-auto border border-blue-200">
                        {step.subtitle}
                      </div>
                      
                      <h4 className="text-xl font-bold text-slate-800 leading-tight">
                        {step.title}
                      </h4>
                      
                      <p className="text-sm text-slate-600 leading-relaxed min-h-[60px] flex items-center justify-center px-2">
                        {step.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-medium">Status</span>
                        <span className="font-bold capitalize text-slate-700">{status}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            status === 'completed' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 w-full animate-shimmer' 
                              : status === 'current'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 w-3/4 animate-pulse'
                                : 'bg-slate-300 w-0'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Action Button with Enhanced Styling */}
                    <div className="pt-4">
                      <button
                        className={`
                          w-full py-3 px-4 rounded-2xl font-bold text-sm shadow-lg border-2 transition-all duration-300
                          ${status === 'completed'
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border-green-300' 
                            : status === 'current'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 border-blue-400 animate-pulse-glow'
                              : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 border-indigo-400'
                          }
                          group-hover:scale-105 hover:shadow-xl
                        `}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          {status === 'completed' ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Review</span>
                            </>
                          ) : status === 'current' ? (
                            <>
                              <Sparkles className="w-4 h-4 animate-spin" />
                              <span>Continue</span>
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-4 h-4" />
                              <span>Start Now</span>
                            </>
                          )}
                        </div>
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
