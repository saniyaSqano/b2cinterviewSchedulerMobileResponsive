
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
        relative p-4 rounded-xl border transition-all duration-500 cursor-pointer group overflow-hidden
        ${isActive 
          ? 'bg-gradient-to-br from-cyan-500/20 via-purple-600/25 to-blue-600/20 border-cyan-400/50 shadow-2xl ring-2 ring-cyan-400/30 text-white backdrop-blur-sm' 
          : isCompleted 
            ? 'bg-gradient-to-br from-purple-500/15 via-cyan-500/10 to-blue-500/15 border-purple-400/40 text-purple-100 backdrop-blur-sm shadow-lg'
            : 'bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40 border-slate-600/40 hover:border-cyan-400/50 hover:shadow-xl text-slate-200 backdrop-blur-sm hover:bg-slate-700/50'
        }
        w-[180px] h-[220px] flex flex-col justify-between transform hover:scale-105 hover:-translate-y-2
      `}
    >
      {/* Card glow effect */}
      {(isActive || isCompleted) && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-blue-400/10 rounded-xl animate-pulse"></div>
      )}
      
      {/* Tech pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-2 right-2 w-4 h-4 border border-current rounded animate-pulse"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border border-current rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Status Indicator */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <div className="relative">
            <CheckCircle className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-sm animate-pulse"></div>
          </div>
        </div>
      )}
      
      {/* Icon with enhanced styling */}
      <div className={`
        w-12 h-12 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-110
        ${isActive 
          ? 'bg-gradient-to-br from-cyan-400/30 to-purple-500/30 text-white border border-cyan-400/50' 
          : isCompleted 
            ? 'bg-gradient-to-br from-purple-400/30 to-cyan-400/20 text-purple-200 border border-purple-400/40'
            : 'bg-gradient-to-br from-slate-600/50 to-slate-700/50 text-slate-300 border border-slate-500/50 group-hover:bg-slate-600/70 group-hover:text-cyan-200'
        }
      `}>
        <IconComponent className="w-6 h-6 relative z-10" />
        {/* Icon glow effect */}
        {(isActive || isCompleted) && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 animate-pulse rounded-xl"></div>
        )}
      </div>
      
      {/* Content with enhanced typography */}
      <div className="flex-1 relative z-10">
        <h3 className={`text-base font-bold mb-2 leading-tight transition-all duration-300 ${
          isActive ? 'text-white' : isCompleted ? 'text-purple-100' : 'text-slate-100 group-hover:text-cyan-200'
        }`}>
          {title}
        </h3>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
          isActive ? 'text-cyan-200' : isCompleted ? 'text-purple-300' : 'text-slate-400 group-hover:text-cyan-300'
        }`}>
          {subtitle}
        </p>
        <p className={`text-xs leading-relaxed line-clamp-3 ${
          isActive ? 'text-cyan-100' : isCompleted ? 'text-purple-200' : 'text-slate-300 group-hover:text-slate-200'
        }`}>
          {description}
        </p>
      </div>
      
      {/* Enhanced progress indicator */}
      <div className={`
        mt-3 h-2 w-full rounded-full overflow-hidden relative
        ${isCompleted 
          ? 'bg-purple-800/50' 
          : isActive 
            ? 'bg-slate-700/50'
            : 'bg-slate-600/30'
        }
      `}>
        <div className={`
          h-full rounded-full transition-all duration-1000 relative overflow-hidden
          ${isCompleted 
            ? 'w-full bg-gradient-to-r from-purple-500 to-cyan-500' 
            : isActive 
              ? 'w-1/3 bg-gradient-to-r from-cyan-400 to-purple-500'
              : 'w-0 bg-gradient-to-r from-slate-500 to-slate-400'
          }
        `}>
          {/* Progress glow effect */}
          {(isCompleted || isActive) && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 to-purple-400/50 animate-pulse"></div>
          )}
        </div>
      </div>
      
      {/* Floating tech elements */}
      <div className="absolute top-1 left-1 w-1 h-1 bg-cyan-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1 right-1 w-1 h-1 bg-purple-400/40 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
    </div>
  );
};

export default LearningCard;
