
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
        relative p-3 rounded-lg border transition-all duration-300 cursor-pointer group bg-white
        ${isActive 
          ? 'border-blue-200 shadow-lg ring-1 ring-blue-100' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
        ${isCompleted ? 'bg-gray-50 border-gray-300' : ''}
        w-[160px] h-[200px] flex flex-col justify-between
      `}
    >
      {/* Status Indicator */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
      )}
      
      {/* Icon */}
      <div className={`
        w-8 h-8 rounded-lg mb-2 flex items-center justify-center
        ${isActive 
          ? 'bg-blue-100 text-blue-600' 
          : isCompleted 
            ? 'bg-gray-100 text-gray-600'
            : 'bg-gray-50 text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600'
        }
      `}>
        <IconComponent className="w-4 h-4" />
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">{title}</h3>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{subtitle}</p>
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{description}</p>
      </div>
      
      {/* Progress Indicator */}
      <div className={`
        mt-2 h-1 w-full rounded-full
        ${isCompleted 
          ? 'bg-gray-200' 
          : isActive 
            ? 'bg-blue-100'
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
