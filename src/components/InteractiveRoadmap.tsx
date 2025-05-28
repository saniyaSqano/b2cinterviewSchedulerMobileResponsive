import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, Target, Zap, Star, ArrowRight, Trophy } from 'lucide-react';

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
      description: "Take our comprehensive assessment to evaluate your current skills and identify areas for improvement",
      position: { x: 15, y: 85 },
      icon: "target"
    },
    {
      id: 1,
      title: "Chat with AI",
      subtitle: "Level 2", 
      description: "Engage with our AI assistant to get personalized feedback and guidance on your performance",
      position: { x: 30, y: 65 },
      icon: "zap"
    },
    {
      id: 2,
      title: "Pitch Yourself",
      subtitle: "Level 3", 
      description: "Learn to create compelling personal pitches and develop your professional presentation skills",
      position: { x: 50, y: 45 },
      icon: "star"
    },
    {
      id: 3,
      title: "Self Practice",
      subtitle: "Level 4",
      description: "Practice your skills with interactive exercises and real-world scenarios at your own pace",
      position: { x: 70, y: 30 },
      icon: "target"
    },
    {
      id: 4,
      title: "AI Proctored Interview",
      subtitle: "Level 5",
      description: "Demonstrate your newly acquired skills in an AI-proctored interview environment",
      position: { x: 85, y: 50 },
      icon: "zap"
    },
    {
      id: 5,
      title: "GameOn",
      subtitle: "Level 6",
      description: "Compete with others and showcase your skills in gamified challenges and competitions",
      position: { x: 90, y: 75 },
      icon: "trophy"
    }
  ];

  const getStepStatus = (index: number): StepStatus => {
    if (completedLevels.includes(index)) return 'completed';
    if (index === currentLevel) return 'current';
    // For testing: allow access to all levels
    return 'available';
  };

  const getStepIcon = (step: RoadmapStep, status: StepStatus) => {
    if (status === 'completed') return <CheckCircle className="w-8 h-8 text-white" />;
    if (status === 'locked') return <Lock className="w-6 h-6 text-slate-400" />;
    
    switch (step.icon) {
      case 'target':
        return <Target className="w-6 h-6" />;
      case 'zap':
        return <Zap className="w-6 h-6" />;
      case 'star':
        return <Star className="w-6 h-6" />;
      case 'trophy':
        return <Trophy className="w-6 h-6" />;
      default:
        return <Circle className="w-6 h-6" />;
    }
  };

  const getStatusColors = (status: StepStatus, isHovered: boolean) => {
    const baseClasses = 'transition-all duration-300 border-3 shadow-lg';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-br from-slate-700 to-slate-800 border-slate-500 shadow-slate-300`;
      case 'current':
        return `${baseClasses} bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400 shadow-blue-200 ring-4 ring-blue-200`;
      case 'available':
        return `${baseClasses} bg-gradient-to-br from-slate-500 to-slate-600 border-slate-400 shadow-slate-200 ${isHovered ? 'shadow-xl border-slate-300' : ''}`;
      default:
        return `${baseClasses} bg-gradient-to-br from-slate-300 to-slate-400 border-slate-200 shadow-slate-100`;
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
      {/* Professional background elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-slate-200/30 to-gray-300/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-slate-300/30 rounded-full blur-xl"></div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Roadmap container - takes most of the space */}
        <div className="flex-1 relative mb-4">
          {/* Professional SVG with subtle gradients */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="completedPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="30%" stopColor="#3b82f6" />
                <stop offset="60%" stopColor="#1e40af" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            
            <path
              d={drawPath()}
              stroke="url(#pathGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="15,8"
              strokeLinecap="round"
              opacity="0.6"
            />
            
            {/* Completed path with professional coloring */}
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

          {/* Steps with professional styling */}
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
                  {/* Professional Step Circle */}
                  <div className={`
                    w-20 h-20 rounded-full flex items-center justify-center mb-4 relative
                    ${getStatusColors(status, isHovered)}
                  `}>
                    {getStepIcon(step, status)}
                    
                    {/* Success indicator for completed steps */}
                    {status === 'completed' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Professional Step Info Card */}
                  <div className={`
                    text-center min-w-max max-w-48 p-4 rounded-xl backdrop-blur-md border
                    ${isHovered 
                      ? 'bg-white/95 shadow-xl border-slate-300' 
                      : 'bg-white/90 border-white/40'
                    }
                  `}>
                    <div className="text-xs font-bold text-slate-600 mb-1 tracking-wide uppercase">
                      {step.subtitle}
                    </div>
                    <div className={`text-sm font-bold mb-2 ${
                      status === 'locked' ? 'text-slate-400' : 'text-slate-800'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {step.description}
                    </div>
                  </div>

                  {/* Professional connection indicators */}
                  {index < roadmapSteps.length - 1 && status !== 'locked' && (
                    <div className="absolute top-10 left-16 opacity-50">
                      <ArrowRight className="w-6 h-6 text-slate-500 drop-shadow-sm" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Professional Progress Section at bottom */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/50 mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-slate-700">
              Learning Progress
            </span>
            <span className="text-xs font-semibold text-white bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-1 rounded-full shadow-sm">
              {completedLevels.length} of {roadmapSteps.length} completed
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-slate-600 to-blue-600 h-3 rounded-full relative shadow-sm transition-all duration-500"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Professional Legend */}
        <div className="flex justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-2 bg-slate-700 text-white px-3 py-1 rounded-lg shadow-sm">
            <CheckCircle className="w-3 h-3" />
            <span className="font-medium">Completed</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-lg shadow-sm">
            <Circle className="w-3 h-3" />
            <span className="font-medium">Current</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-500 text-white px-3 py-1 rounded-lg shadow-sm">
            <Circle className="w-3 h-3" />
            <span className="font-medium">Available</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-400 text-white px-3 py-1 rounded-lg shadow-sm">
            <Lock className="w-3 h-3" />
            <span className="font-medium">Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
