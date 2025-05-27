
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
      position: { x: 10, y: 85 },
      icon: "target"
    },
    {
      id: 1,
      title: "Chat with AI",
      subtitle: "Level 2",
      description: "Get personalized feedback from our AI mentor",
      position: { x: 25, y: 65 },
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
      title: "Self Practice",
      subtitle: "Level 4",
      description: "Refine your skills through guided practice",
      position: { x: 65, y: 30 },
      icon: "target"
    },
    {
      id: 4,
      title: "AI Proctored Interview",
      subtitle: "Level 5",
      description: "Demonstrate mastery in realistic scenarios",
      position: { x: 80, y: 50 },
      icon: "zap"
    },
    {
      id: 5,
      title: "Game on",
      subtitle: "Level 6",
      description: "Compete and showcase your expertise",
      position: { x: 90, y: 20 },
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
    const baseClasses = 'transition-all duration-300 border-4 shadow-lg';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500 border-green-300 shadow-green-200`;
      case 'current':
        return `${baseClasses} bg-blue-600 border-blue-300 shadow-blue-200 ring-4 ring-blue-200`;
      case 'available':
        return `${baseClasses} bg-white border-gray-300 shadow-gray-200 hover:shadow-xl hover:border-blue-400 ${isHovered ? 'scale-110 border-blue-400' : ''}`;
      default:
        return `${baseClasses} bg-gray-100 border-gray-200 shadow-gray-100`;
    }
  };

  const getTextColors = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return 'text-white';
      case 'current':
        return 'text-white';
      case 'available':
        return 'text-gray-800';
      default:
        return 'text-gray-400';
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
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 relative overflow-hidden shadow-lg">
      <div className="relative z-10">
        <div className="relative h-96 w-full mb-8">
          {/* Enhanced SVG with better path styling */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Background path with gradient */}
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#d1d5db" />
              </linearGradient>
              <linearGradient id="completedPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            
            <path
              d={drawPath()}
              stroke="url(#pathGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="12,6"
              strokeLinecap="round"
            />
            
            {/* Completed path with enhanced styling */}
            {completedLevels.length > 0 && (
              <path
                d={getCompletedPath()}
                stroke="url(#completedPathGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {/* Steps with enhanced positioning and styling */}
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
                    relative transition-all duration-300 cursor-pointer
                    ${isClickable ? 'hover:scale-105' : 'cursor-not-allowed'}
                  `}
                >
                  {/* Enhanced Step Circle */}
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center mb-3 relative
                    ${getStatusColors(status, isHovered)}
                  `}>
                    {getStepIcon(step, status)}
                    
                    {/* Pulse effect for current step */}
                    {status === 'current' && (
                      <div className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></div>
                    )}
                  </div>

                  {/* Enhanced Step Info Card */}
                  <div className={`
                    text-center min-w-max max-w-48 p-3 rounded-xl transition-all duration-300 backdrop-blur-sm
                    ${isHovered ? 'bg-white/95 shadow-xl scale-105 border border-gray-200' : 'bg-white/80'}
                  `}>
                    <div className="text-xs font-semibold text-blue-600 mb-1 tracking-wide">
                      {step.subtitle}
                    </div>
                    <div className={`text-sm font-bold mb-2 ${getTextColors(status === 'locked' ? 'locked' : 'available')}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </div>
                  </div>

                  {/* Enhanced connection indicators */}
                  {index < roadmapSteps.length - 1 && status !== 'locked' && (
                    <div className="absolute top-8 left-14 opacity-60">
                      <ArrowRight className="w-5 h-5 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Progress Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-800">Progress</span>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {completedLevels.length} of {roadmapSteps.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="flex justify-center space-x-8 mt-6 text-sm">
          <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-700 font-medium">Completed</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-lg">
            <Circle className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700 font-medium">Current</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-lg">
            <Circle className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-medium">Available</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-lg">
            <Lock className="w-4 h-4 text-gray-300" />
            <span className="text-gray-700 font-medium">Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
