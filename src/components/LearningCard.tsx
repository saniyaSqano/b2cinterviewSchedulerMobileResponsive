
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
        relative p-6 rounded-lg border transition-all duration-300 cursor-pointer group bg-white
        ${isActive 
          ? 'border-slate-300 shadow-lg ring-1 ring-slate-200' 
          : 'border-slate-200 hover:border-slate-300'
        }
        ${isCompleted ? 'border-slate-300 bg-slate-50' : ''}
        hover:shadow-md
      `}
    >
      {/* Status Indicator */}
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <CheckCircle className="w-5 h-5 text-slate-600" />
        </div>
      )}
      
      {/* Icon */}
      <div className={`
        w-12 h-12 rounded-lg mb-4 flex items-center justify-center
        ${isActive 
          ? 'bg-slate-100 text-slate-700' 
          : isCompleted 
            ? 'bg-slate-100 text-slate-600'
            : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-600'
        }
      `}>
        <IconComponent className="w-6 h-6" />
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{subtitle}</p>
        </div>
        <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
      </div>
      
      {/* Progress Indicator */}
      <div className={`
        mt-4 h-1 w-full rounded-full
        ${isCompleted 
          ? 'bg-slate-200' 
          : isActive 
            ? 'bg-slate-200'
            : 'bg-slate-100'
        }
      `}>
        <div className={`
          h-full rounded-full transition-all duration-500
          ${isCompleted 
            ? 'w-full bg-slate-600' 
            : isActive 
              ? 'w-1/3 bg-slate-500'
              : 'w-0 bg-slate-300'
          }
        `} />
      </div>
    </div>
  );
};

export default LearningCard;
