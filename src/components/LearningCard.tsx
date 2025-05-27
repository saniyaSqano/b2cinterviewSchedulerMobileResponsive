
import React from 'react';
import { GraduationCap, User } from 'lucide-react';

interface LearningCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: 'graduation-cap' | 'user';
  isCompleted?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const LearningCard: React.FC<LearningCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  isCompleted = false,
  isActive = false,
  onClick
}) => {
  const IconComponent = icon === 'graduation-cap' ? GraduationCap : User;

  return (
    <div
      onClick={onClick}
      className={`
        relative p-6 rounded-xl border transition-all duration-300 cursor-pointer shadow-lg
        ${isActive 
          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
        }
        ${isCompleted ? 'border-green-300 bg-green-50' : ''}
        hover:scale-105 hover:shadow-xl
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{subtitle}</p>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
        <div className={`
          p-3 rounded-lg ml-4
          ${isActive ? 'bg-blue-100' : 'bg-purple-100'}
        `}>
          <IconComponent className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-purple-600'}`} />
        </div>
      </div>
      
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default LearningCard;
