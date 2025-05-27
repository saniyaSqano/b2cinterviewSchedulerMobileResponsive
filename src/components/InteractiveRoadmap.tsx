
import React from 'react';
import { CheckCircle, Circle, Lock, MapPin, ArrowRight } from 'lucide-react';

interface RoadmapStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  position: { x: number; y: number };
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
  const roadmapSteps: RoadmapStep[] = [
    {
      id: 0,
      title: "Assessment",
      subtitle: "Level 1",
      description: "Start your journey",
      position: { x: 10, y: 80 }
    },
    {
      id: 1,
      title: "Chat with AI",
      subtitle: "Level 2",
      description: "Get feedback",
      position: { x: 25, y: 60 }
    },
    {
      id: 2,
      title: "Pitch Yourself",
      subtitle: "Level 3",
      description: "Present yourself",
      position: { x: 45, y: 40 }
    },
    {
      id: 3,
      title: "Self Practice",
      subtitle: "Level 4",
      description: "Hone your skills",
      position: { x: 65, y: 30 }
    },
    {
      id: 4,
      title: "AI Proctored Interview",
      subtitle: "Level 5",
      description: "Final assessment",
      position: { x: 80, y: 50 }
    },
    {
      id: 5,
      title: "Game on",
      subtitle: "Level 6",
      description: "Master level",
      position: { x: 90, y: 20 }
    }
  ];

  const getStepStatus = (index: number) => {
    if (completedLevels.includes(index)) return 'completed';
    if (index === currentLevel) return 'current';
    if (index < currentLevel) return 'available';
    if (index === roadmapSteps.length - 1) return 'locked'; // Game on is always locked until all others complete
    return 'locked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'current':
        return <Circle className="w-6 h-6 text-blue-600 animate-pulse" />;
      case 'available':
        return <Circle className="w-6 h-6 text-gray-400" />;
      default:
        return <Lock className="w-6 h-6 text-gray-300" />;
    }
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'current':
        return 'bg-blue-100 border-blue-300 text-blue-800 shadow-lg';
      case 'available':
        return 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-400';
    }
  };

  const drawPath = () => {
    let pathData = '';
    roadmapSteps.forEach((step, index) => {
      if (index === 0) {
        pathData += `M ${step.position.x} ${step.position.y}`;
      } else {
        pathData += ` L ${step.position.x} ${step.position.y}`;
      }
    });
    return pathData;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-green-200 rounded-full"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Journey</h2>
          <p className="text-gray-600">Navigate through each level to master your skills</p>
        </div>

        <div className="relative h-80 w-full">
          {/* Path line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d={drawPath()}
              stroke="#e5e7eb"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2,2"
            />
          </svg>

          {/* Steps */}
          {roadmapSteps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = status === 'current' || status === 'available' || status === 'completed';

            return (
              <div
                key={step.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${step.position.x}%`,
                  top: `${step.position.y}%`
                }}
              >
                <div
                  onClick={() => isClickable && status !== 'locked' && onStepClick(index)}
                  className={`
                    relative cursor-pointer transition-all duration-300 hover:scale-105
                    ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                  `}
                >
                  {/* Step circle */}
                  <div className={`
                    w-16 h-16 rounded-full border-2 flex items-center justify-center mb-2
                    transition-all duration-300 ${getStatusColors(status)}
                  `}>
                    {getStatusIcon(status)}
                  </div>

                  {/* Step info */}
                  <div className="text-center min-w-max">
                    <div className="text-xs font-medium text-gray-500 mb-1">{step.subtitle}</div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{step.title}</div>
                    <div className="text-xs text-gray-600">{step.description}</div>
                  </div>

                  {/* Pulse animation for current step */}
                  {status === 'current' && (
                    <div className="absolute inset-0 w-16 h-16 rounded-full bg-blue-400 opacity-25 animate-ping"></div>
                  )}
                </div>

                {/* Arrow between steps */}
                {index < roadmapSteps.length - 1 && (
                  <div className="absolute top-8 left-12">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {completedLevels.length} of {roadmapSteps.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedLevels.length / roadmapSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-6 text-xs">
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
