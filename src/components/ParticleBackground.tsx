
import React from 'react';

const ParticleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Enhanced light-themed particle system */}
      <div className="absolute inset-0">
        {/* Neural network connections with light theme */}
        <svg className="absolute inset-0 w-full h-full opacity-10" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="lightNeuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Animated neural network lines */}
          <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="url(#lightNeuralGradient)" strokeWidth="1" className="animate-pulse" style={{ animationDuration: '3s' }} />
          <line x1="30%" y1="40%" x2="60%" y2="30%" stroke="url(#lightNeuralGradient)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <line x1="60%" y1="30%" x2="80%" y2="60%" stroke="url(#lightNeuralGradient)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <line x1="20%" y1="70%" x2="50%" y2="80%" stroke="url(#lightNeuralGradient)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
          <line x1="50%" y1="80%" x2="90%" y2="70%" stroke="url(#lightNeuralGradient)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3.8s' }} />
        </svg>
        
        {/* Enhanced floating particles with light colors */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`light-particle-${i}`}
            className={`absolute rounded-full ${
              i % 4 === 0 ? 'bg-blue-400/20' : 
              i % 4 === 1 ? 'bg-cyan-400/15' : 
              i % 4 === 2 ? 'bg-indigo-400/15' : 'bg-blue-300/25'
            } animate-pulse`}
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Light circuit board patterns */}
        <div className="absolute top-10 left-10 w-40 h-40 opacity-5">
          <div className="w-full h-full relative">
            {/* Circuit traces with light colors */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse" style={{ animationDuration: '2s' }}></div>
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-pulse" style={{ animationDelay: '1s', animationDuration: '2.5s' }}></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-indigo-400/30 to-transparent animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
            <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-transparent via-blue-400/30 to-transparent animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '2.2s' }}></div>
          </div>
        </div>
        
        {/* Data stream visualization with light theme */}
        <div className="absolute top-1/3 right-20 space-y-2 opacity-15">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`light-data-stream-${i}`}
              className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1.5 + Math.random() * 1}s`
              }}
            />
          ))}
        </div>
        
        {/* Light quantum dots pattern */}
        <div className="absolute bottom-1/4 left-1/3 grid grid-cols-4 gap-2 opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`light-quantum-dot-${i}`}
              className="w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"
              style={{
                animationDelay: `${(i % 4) * 0.3}s`,
                animationDuration: `${2 + (i % 3)}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Light themed geometric elements */}
      <div className="absolute top-10 right-10 w-32 h-32 border-2 border-blue-300/15 rounded-lg animate-spin opacity-20" style={{ animationDuration: '25s' }}></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-cyan-300/20 rounded-full animate-spin opacity-25" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
      
      {/* Light holographic effect layers */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/5 via-transparent to-cyan-100/5 animate-pulse opacity-30" style={{ animationDuration: '4s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-indigo-100/3 via-transparent to-blue-100/3 animate-pulse opacity-25" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
    </div>
  );
};

export default ParticleBackground;
