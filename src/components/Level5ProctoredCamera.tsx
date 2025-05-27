
import React, { useRef, useEffect, useState } from 'react';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

interface Level5ProctoredCameraProps {
  isVideoOn: boolean;
  isMicOn: boolean;
  onToggleVideo: () => void;
  onToggleMic: () => void;
  cameraError: string | null;
  onStartCamera: () => void;
  isStartingCamera: boolean;
}

const Level5ProctoredCamera: React.FC<Level5ProctoredCameraProps> = ({
  isVideoOn,
  isMicOn,
  onToggleVideo,
  onToggleMic,
  cameraError,
  onStartCamera,
  isStartingCamera
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="bg-white/90 rounded-2xl p-4 h-4/5 flex flex-col mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Proctored Camera Feed</h3>
        <div className="flex items-center space-x-2 text-sm text-red-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-medium">LIVE</span>
        </div>
      </div>
      <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden relative">
        {isStartingCamera ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-white text-lg">Initializing proctored camera...</p>
          </div>
        ) : cameraError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
            <VideoOff className="w-16 h-16 text-red-400 mb-4" />
            <p className="text-red-400 text-lg mb-4">{cameraError}</p>
            <button
              onClick={onStartCamera}
              className="mt-4 px-6 py-3 bg-purple-500 text-white text-lg rounded-full hover:bg-purple-600 transition-colors"
            >
              Enable Camera (Required)
            </button>
          </div>
        ) : isVideoOn ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
            <VideoOff className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-400 text-lg mb-4">Camera Required for Proctored Interview</p>
            <button
              onClick={onStartCamera}
              className="px-6 py-3 bg-purple-500 text-white text-lg rounded-full hover:bg-purple-600 transition-colors"
            >
              Start Camera
            </button>
          </div>
        )}
      </div>
      
      {/* Video Controls */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={onToggleVideo}
          disabled={isStartingCamera}
          className={`p-3 rounded-full transition-colors ${
            isVideoOn 
              ? 'bg-gray-200 hover:bg-gray-300' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          } ${isStartingCamera ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
        <button
          onClick={onToggleMic}
          className={`p-3 rounded-full transition-colors ${
            isMicOn 
              ? 'bg-gray-200 hover:bg-gray-300' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Level5ProctoredCamera;
