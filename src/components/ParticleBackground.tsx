
import React from 'react';

const ParticleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/5 to-gray-500/5"></div>
      </div>
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 rounded-full"></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-gray-400/20 rounded-full"></div>
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-300/15 rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-gray-300/15 rounded-full"></div>
      
      {/* Additional subtle geometric elements */}
      <div className="absolute top-10 right-10 w-20 h-20 border border-gray-200/30 rounded-lg rotate-12"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 border border-blue-200/20 rounded-full"></div>
    </div>
  );
};

export default ParticleBackground;
