
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
        relative p-3 rounded-xl border transition-all duration-300 cursor-pointer group
        ${isActive 
          ? 'bg-gradient-to-br from-purple-500 to-blue-600 border-purple-200 shadow-xl ring-1 ring-purple-100 text-white' 
          : isCompleted 
            ? 'bg-gradient-to-br from-purple-100 to-blue-100 border-purple-300 text-purple-800'
            : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg text-gray-700'
        }
        w-[160px] h-[200px] flex flex-col justify-between
      `}
    >
      {/* Status Indicator */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-4 h-4 text-purple-600" />
        </div>
      )}
      
      {/* Icon */}
      <div className={`
        w-8 h-8 rounded-lg mb-2 flex items-center justify-center
        ${isActive 
          ? 'bg-white/20 text-white' 
          : isCompleted 
            ? 'bg-purple-200 text-purple-700'
            : 'bg-purple-50 text-purple-500 group-hover:bg-purple-100 group-hover:text-purple-600'
        }
      `}>
        <IconComponent className="w-4 h-4" />
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h3 className={`text-sm font-semibold mb-1 leading-tight ${
          isActive ? 'text-white' : isCompleted ? 'text-purple-800' : 'text-gray-900'
        }`}>
          {title}
        </h3>
        <p className={`text-xs font-medium uppercase tracking-wide mb-2 ${
          isActive ? 'text-purple-100' : isCompleted ? 'text-purple-600' : 'text-purple-500'
        }`}>
          {subtitle}
        </p>
        <p className={`text-xs leading-relaxed line-clamp-3 ${
          isActive ? 'text-purple-50' : isCompleted ? 'text-purple-700' : 'text-gray-600'
        }`}>
          {description}
        </p>
      </div>
      
      {/* Progress Indicator */}
      <div className={`
        mt-2 h-1 w-full rounded-full
        ${isCompleted 
          ? 'bg-purple-200' 
          : isActive 
            ? 'bg-white/20'
            : 'bg-purple-100'
        }
      `}>
        <div className={`
          h-full rounded-full transition-all duration-500
          ${isCompleted 
            ? 'w-full bg-purple-600' 
            : isActive 
              ? 'w-1/3 bg-white'
              : 'w-0 bg-purple-300'
          }
        `} />
      </div>
    </div>
  );
};

export default LearningCard;
