
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
        relative p-6 rounded-xl border transition-all duration-300 cursor-pointer
        ${isActive 
          ? 'bg-blue-900/40 border-blue-500/50 shadow-lg shadow-blue-500/20' 
          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600/50'
        }
        ${isCompleted ? 'border-green-500/50 bg-green-900/20' : ''}
        backdrop-blur-sm hover:scale-105
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-400 mb-3">{subtitle}</p>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
        <div className={`
          p-3 rounded-lg ml-4
          ${isActive ? 'bg-blue-500/20' : 'bg-purple-500/20'}
        `}>
          <IconComponent className={`w-6 h-6 ${isActive ? 'text-blue-400' : 'text-purple-400'}`} />
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
