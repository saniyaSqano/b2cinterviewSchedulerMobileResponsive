
import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, MapPin, ArrowRight, Star, Zap, Target } from 'lucide-react';

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
      position: { x: 50, y: 45 },
      icon: "star"
    },
    {
      id: 3,
      title: "Self Practice",
      subtitle: "Level 4",
      description: "Refine your skills through guided practice",
      position: { x: 70, y: 35 },
      icon: "target"
    },
    {
      id: 4,
      title: "AI Proctored Interview",
      subtitle: "Level 5",
      description: "Demonstrate mastery in realistic scenarios",
      position: { x: 85, y: 55 },
      icon: "zap"
    },
    {
      id: 5,
      title: "Game on",
      subtitle: "Level 6",
      description: "Compete and showcase your expertise",
      position: { x: 90, y: 25 },
      icon: "star"
    }
  ];

  const getStepStatus = (index: number): StepStatus => {
    if (completedLevels.includes(index)) return 'completed';
    if (index === currentLevel) return 'current';
    if (index < currentLevel) return 'available';
    if (index === roadmapSteps.length - 1) return 'locked';
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
    const baseClasses = 'transition-all duration-300 border-4';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-br from-green-500 to-green-600 border-green-300 shadow-xl ${isHovered ? 'shadow-2xl scale-110' : ''}`;
      case 'current':
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-purple-600 border-blue-300 shadow-xl animate-pulse ${isHovered ? 'shadow-2xl scale-110' : ''}`;
      case 'available':
        return `${baseClasses} bg-gradient-to-br from-white to-gray-50 border-gray-300 shadow-lg hover:shadow-xl ${isHovered ? 'scale-110 border-blue-400' : ''}`;
      default:
        return `${baseClasses} bg-gray-100 border-gray-200 shadow-sm ${isHovered ? 'scale-105' : ''}`;
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
        const midX = (prevStep.position.x + step.position.x) / 2;
        const midY = (prevStep.position.y + step.position.y) / 2;
        pathData += ` Q ${midX} ${midY - 5} ${step.position.x} ${step.position.y}`;
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
        const midX = (prevStep.position.x + step.position.x) / 2;
        const midY = (prevStep.position.y + step.position.y) / 2;
        pathData += ` Q ${midX} ${midY - 5} ${step.position.x} ${step.position.y}`;
      }
    });
    return pathData;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 right-1/4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-md"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Learning Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Navigate through each level to master your skills and unlock new challenges
          </p>
        </div>

        <div className="relative h-96 w-full mb-8">
          {/* Enhanced Path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Background path */}
            <path
              d={drawPath()}
              stroke="#e5e7eb"
              strokeWidth="1"
              fill="none"
              strokeDasharray="5,5"
              className="opacity-50"
            />
            
            {/* Completed path */}
            {completedLevels.length > 0 && (
              <path
                d={getCompletedPath()}
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
                className="drop-shadow-sm"
              />
            )}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Enhanced Steps */}
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
                    relative transition-all duration-500 transform
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                    ${isHovered ? 'z-50' : 'z-10'}
                  `}
                >
                  {/* Enhanced Step Circle */}
                  <div className={`
                    w-20 h-20 rounded-full flex items-center justify-center mb-3 relative
                    ${getStatusColors(status, isHovered)}
                  `}>
                    {getStepIcon(step, status)}
                    
                    {/* Ripple effect for current step */}
                    {status === 'current' && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-25 animate-ping"></div>
                        <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20 animate-ping" style={{ animationDelay: '1s' }}></div>
                      </>
                    )}
                    
                    {/* Glow effect for completed steps */}
                    {status === 'completed' && (
                      <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 blur-lg"></div>
                    )}
                  </div>

                  {/* Enhanced Step Info with tooltip-like appearance */}
                  <div className={`
                    text-center min-w-max max-w-48 p-3 rounded-xl transition-all duration-300
                    ${isHovered ? 'bg-white shadow-2xl scale-105 border border-gray-200' : 'bg-transparent'}
                  `}>
                    <div className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
                      isHovered ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.subtitle}
                    </div>
                    <div className={`text-lg font-bold mb-2 transition-colors duration-300 ${getTextColors(status)}`}>
                      {step.title}
                    </div>
                    <div className={`text-sm transition-all duration-300 ${
                      isHovered ? 'text-gray-700 opacity-100' : 'text-gray-600 opacity-75'
                    }`}>
                      {step.description}
                    </div>
                  </div>

                  {/* Connection indicators */}
                  {index < roadmapSteps.length - 1 && status !== 'locked' && (
                    <div className="absolute top-10 left-16 opacity-60">
                      <ArrowRight className={`w-5 h-5 transition-colors duration-300 ${
                        completedLevels.includes(index) ? 'text-green-500' : 'text-gray-400'
                      }`} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Progress Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-800">Journey Progress</span>
            <span className="text-lg text-gray-600 font-medium">
              {completedLevels.length} of {roadmapSteps.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-4 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="flex justify-center space-x-8 mt-8 text-sm">
          <div className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-gray-700 font-medium">Completed</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-2">
            <Circle className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-medium">Current</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-2">
            <Circle className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700 font-medium">Available</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-2">
            <Lock className="w-5 h-5 text-gray-300" />
            <span className="text-gray-700 font-medium">Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
