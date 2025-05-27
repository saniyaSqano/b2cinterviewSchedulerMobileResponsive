
import React from 'react';
import { GraduationCap, User, CheckCircle } from 'lucide-react';

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
        relative p-8 rounded-2xl border transition-all duration-300 cursor-pointer group
        ${isActive 
          ? 'bg-blue-50 border-blue-200 shadow-lg ring-2 ring-blue-100' 
          : 'bg-white border-gray-200 hover:border-gray-300'
        }
        ${isCompleted ? 'bg-green-50 border-green-200' : ''}
        hover:shadow-xl hover:-translate-y-1
      `}
    >
      {/* Status Indicator */}
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
      )}
      
      {/* Icon */}
      <div className={`
        w-16 h-16 rounded-xl mb-6 flex items-center justify-center
        ${isActive 
          ? 'bg-blue-100 text-blue-600' 
          : isCompleted 
            ? 'bg-green-100 text-green-600'
            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
        }
      `}>
        <IconComponent className="w-8 h-8" />
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{subtitle}</p>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
      </div>
      
      {/* Progress Indicator */}
      <div className={`
        mt-6 h-1 w-full rounded-full
        ${isCompleted 
          ? 'bg-green-200' 
          : isActive 
            ? 'bg-blue-200'
            : 'bg-gray-100'
        }
      `}>
        <div className={`
          h-full rounded-full transition-all duration-500
          ${isCompleted 
            ? 'w-full bg-green-500' 
            : isActive 
              ? 'w-1/3 bg-blue-500'
              : 'w-0 bg-gray-300'
          }
        `} />
      </div>
    </div>
  );
};

export default LearningCard;
