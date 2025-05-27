import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, Target, Zap, Star, ArrowRight } from 'lucide-react';

interface RoadmapStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  position: { x: number; y: number };
  icon?: string;
}

interface InteractiveRoadmapProps {
  currentLevel: number;
  completedLevels: number[];
  onStepClick: (index: number) => void;
}

type StepStatus = 'completed' | 'current' | 'available' | 'locked';

const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({
  currentLevel,
  completedLevels,
  onStepClick
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const roadmapSteps: RoadmapStep[] = [
    {
      id: 0,
      title: "Assessment",
      subtitle: "Level 1",
      description: "Start your journey with a comprehensive skill evaluation",
      position: { x: 15, y: 85 },
      icon: "target"
    },
    {
      id: 1,
      title: "Chat with AI",
      subtitle: "Level 2",
      description: "Get personalized feedback from our AI mentor",
      position: { x: 30, y: 65 },
      icon: "zap"
    },
    {
      id: 2,
      title: "Pitch Yourself",
      subtitle: "Level 3",
      description: "Master the art of professional presentation",
      position: { x: 45, y: 45 },
      icon: "star"
    },
    {
      id: 3,
      title: "AI Proctored Interview",
      subtitle: "Level 4",
      description: "Demonstrate mastery in realistic scenarios",
      position: { x: 60, y: 30 },
      icon: "zap"
    },
    {
      id: 4,
      title: "Self Practice",
      subtitle: "Level 5",
      description: "Refine your skills through guided practice",
      position: { x: 75, y: 50 },
      icon: "target"
    },
    {
      id: 5,
      title: "Game on",
      subtitle: "Level 6",
      description: "Compete and showcase your expertise",
      position: { x: 85, y: 20 },
      icon: "star"
    }
  ];

  const getStepStatus = (index: number): StepStatus => {
    if (completedLevels.includes(index)) return 'completed';
    if (index === currentLevel) return 'current';
    if (index <= currentLevel) return 'available';
    return 'locked';
  };

  const getStepIcon = (step: RoadmapStep, status: StepStatus) => {
    if (status === 'completed') return <CheckCircle className="w-8 h-8 text-white" />;
    if (status === 'locked') return <Lock className="w-6 h-6 text-gray-400" />;
    
    switch (step.icon) {
      case 'target':
        return <Target className="w-6 h-6" />;
      case 'zap':
        return <Zap className="w-6 h-6" />;
      case 'star':
        return <Star className="w-6 h-6" />;
      default:
        return <Circle className="w-6 h-6" />;
    }
  };

  const getStatusColors = (status: StepStatus, isHovered: boolean) => {
    const baseClasses = 'transition-all duration-200 border-4 shadow-lg';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-300 shadow-emerald-200`;
      case 'current':
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-300 shadow-blue-200 ring-4 ring-blue-200`;
      case 'available':
        return `${baseClasses} bg-gradient-to-br from-purple-500 to-violet-600 border-purple-300 shadow-purple-200 ${isHovered ? 'shadow-xl border-purple-400' : ''}`;
      default:
        return `${baseClasses} bg-gradient-to-br from-gray-300 to-gray-400 border-gray-200 shadow-gray-100`;
    }
  };

  const drawPath = () => {
    let pathData = '';
    roadmapSteps.forEach((step, index) => {
      if (index === 0) {
        pathData += `M ${step.position.x} ${step.position.y}`;
      } else {
        const prevStep = roadmapSteps[index - 1];
        const controlX1 = prevStep.position.x + (step.position.x - prevStep.position.x) * 0.3;
        const controlY1 = prevStep.position.y + (step.position.y - prevStep.position.y) * 0.3;
        const controlX2 = prevStep.position.x + (step.position.x - prevStep.position.x) * 0.7;
        const controlY2 = prevStep.position.y + (step.position.y - prevStep.position.y) * 0.7;
        pathData += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${step.position.x} ${step.position.y}`;
      }
    });
    return pathData;
  };

  const getCompletedPath = () => {
    if (completedLevels.length === 0) return '';
    
    let pathData = '';
    const lastCompleted = Math.max(...completedLevels);
    
    roadmapSteps.slice(0, lastCompleted + 1).forEach((step, index) => {
      if (index === 0) {
        pathData += `M ${step.position.x} ${step.position.y}`;
      } else {
        const prevStep = roadmapSteps[index - 1];
        const controlX1 = prevStep.position.x + (step.position.x - prevStep.position.x) * 0.3;
        const controlY1 = prevStep.position.y + (step.position.y - prevStep.position.y) * 0.3;
        const controlX2 = prevStep.position.x + (step.position.x - prevStep.position.x) * 0.7;
        const controlY2 = prevStep.position.y + (step.position.y - prevStep.position.y) * 0.7;
        pathData += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${step.position.x} ${step.position.y}`;
      }
    });
    return pathData;
  };

  return (
    <div className="h-screen flex flex-col p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Roadmap container - takes most of the space */}
        <div className="flex-1 relative mb-4">
          {/* Enhanced SVG with colorful gradients */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="50%" stopColor="#c7d2fe" />
                <stop offset="100%" stopColor="#ddd6fe" />
              </linearGradient>
              <linearGradient id="completedPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="30%" stopColor="#3b82f6" />
                <stop offset="60%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            
            <path
              d={drawPath()}
              stroke="url(#pathGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="15,8"
              strokeLinecap="round"
              opacity="0.7"
            />
            
            {/* Completed path with enhanced coloring */}
            {completedLevels.length > 0 && (
              <path
                d={getCompletedPath()}
                stroke="url(#completedPathGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {/* Steps with enhanced colorful styling */}
          {roadmapSteps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = status === 'current' || status === 'available' || status === 'completed';
            const isHovered = hoveredStep === index;

            return (
              <div
                key={step.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${step.position.x}%`,
                  top: `${step.position.y}%`
                }}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div
                  onClick={() => isClickable && onStepClick(index)}
                  className={`
                    relative cursor-pointer
                    ${isClickable ? 'hover:scale-105' : 'cursor-not-allowed'}
                  `}
                >
                  {/* Enhanced Colorful Step Circle */}
                  <div className={`
                    w-20 h-20 rounded-full flex items-center justify-center mb-4 relative
                    ${getStatusColors(status, isHovered)}
                  `}>
                    {getStepIcon(step, status)}
                    
                    {/* Sparkle effect for completed steps */}
                    {status === 'completed' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full">
                        <Star className="w-3 h-3 text-white m-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Enhanced Colorful Step Info Card */}
                  <div className={`
                    text-center min-w-max max-w-48 p-4 rounded-2xl backdrop-blur-md border
                    ${isHovered 
                      ? 'bg-white/95 shadow-2xl border-purple-300' 
                      : 'bg-white/85 border-white/30'
                    }
                  `}>
                    <div className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1 tracking-wide uppercase">
                      {step.subtitle}
                    </div>
                    <div className={`text-sm font-bold mb-2 ${
                      status === 'locked' ? 'text-gray-400' : 'text-gray-800'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </div>
                  </div>

                  {/* Colorful connection indicators */}
                  {index < roadmapSteps.length - 1 && status !== 'locked' && (
                    <div className="absolute top-10 left-16 opacity-70">
                      <ArrowRight className="w-6 h-6 text-purple-500 drop-shadow-lg" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed Progress Section at bottom */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Progress Journey
            </span>
            <span className="text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full shadow-lg">
              {completedLevels.length} of {roadmapSteps.length} completed
            </span>
          </div>
          <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-500 via-blue-500 via-purple-500 to-pink-500 h-4 rounded-full relative shadow-lg"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Colorful Legend */}
        <div className="flex justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-xl shadow-lg">
            <CheckCircle className="w-3 h-3" />
            <span className="font-semibold">Completed</span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-xl shadow-lg">
            <Circle className="w-3 h-3" />
            <span className="font-semibold">Current</span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white px-3 py-1 rounded-xl shadow-lg">
            <Circle className="w-3 h-3" />
            <span className="font-semibold">Available</span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-1 rounded-xl shadow-lg">
            <Lock className="w-3 h-3" />
            <span className="font-semibold">Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
