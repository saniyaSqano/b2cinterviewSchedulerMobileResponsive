
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
    if (index <= currentLevel) return 'available';
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
    const baseClasses = 'transition-colors duration-200 border-4';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500 border-green-300 shadow-lg`;
      case 'current':
        return `${baseClasses} bg-blue-600 border-blue-300 shadow-lg`;
      case 'available':
        return `${baseClasses} bg-white border-gray-300 shadow-md hover:shadow-lg ${isHovered ? 'border-blue-400' : ''}`;
      default:
        return `${baseClasses} bg-gray-100 border-gray-200 shadow-sm`;
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
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 relative overflow-hidden shadow-lg">
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your Learning Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Navigate through each level to master your skills and unlock new challenges
          </p>
        </div>

        <div className="relative h-96 w-full mb-6">
          {/* Path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Background path */}
            <path
              d={drawPath()}
              stroke="#e5e7eb"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8,4"
            />
            
            {/* Completed path */}
            {completedLevels.length > 0 && (
              <path
                d={getCompletedPath()}
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
              />
            )}
          </svg>

          {/* Steps */}
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
                    relative transition-all duration-200
                    ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                  `}
                >
                  {/* Step Circle */}
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center mb-2 relative
                    ${getStatusColors(status, isHovered)}
                  `}>
                    {getStepIcon(step, status)}
                  </div>

                  {/* Step Info */}
                  <div className={`
                    text-center min-w-max max-w-40 p-2 rounded-lg transition-all duration-200
                    ${isHovered ? 'bg-white shadow-lg' : 'bg-transparent'}
                  `}>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {step.subtitle}
                    </div>
                    <div className={`text-sm font-bold mb-1 ${getTextColors(status)}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {step.description}
                    </div>
                  </div>

                  {/* Connection arrow */}
                  {index < roadmapSteps.length - 1 && (
                    <div className="absolute top-8 left-12 opacity-40">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {completedLevels.length} of {roadmapSteps.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-6 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <Circle className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <Circle className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-gray-300" />
            <span className="text-gray-600">Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
