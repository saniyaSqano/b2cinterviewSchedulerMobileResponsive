
import React from 'react';

const ParticleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
      </div>
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-300/20 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-300/20 rounded-full animate-bounce delay-1000"></div>
    </div>
  );
};

export default ParticleBackground;
