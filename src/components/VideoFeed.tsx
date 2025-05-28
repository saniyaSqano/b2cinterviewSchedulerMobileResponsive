import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Video, VideoOff } from 'lucide-react';
import Webcam from 'react-webcam';

interface VideoFeedProps {
  onStatusChange?: (isVideoOn: boolean) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ onStatusChange }) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [key, setKey] = useState(0); // Used to force remount of webcam component

  // Notify parent component when video status changes
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(isVideoOn);
    }
  }, [isVideoOn, onStatusChange]);

  // Handle webcam errors
  const handleWebcamError = useCallback((err: string | DOMException) => {
    console.error('Webcam error:', err);
    setError(`Unable to access camera: ${err instanceof DOMException ? err.message : err}`);
    setIsVideoOn(false);
    setIsStarting(false);
  }, []);

  // Handle successful webcam start
  const handleWebcamStart = useCallback(() => {
    console.log('Webcam started successfully');
    setIsVideoOn(true);
    setIsStarting(false);
    setError(null);
  }, []);

  const startCamera = useCallback(() => {
    setIsStarting(true);
    setError(null);
    console.log('Starting camera...');
    // The webcam will start automatically when mounted
    setKey(prevKey => prevKey + 1); // Force remount of webcam component
  }, []);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera');
    setIsVideoOn(false);
    // The webcam component will handle cleanup of media streams
  }, []);

  const toggleCamera = useCallback(() => {
    if (isVideoOn) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [isVideoOn, startCamera, stopCamera]);

  const retryCamera = useCallback(() => {
    startCamera();
  }, [startCamera]);

  // Video constraints
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <div className="bg-white/90 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Video</h3>
      <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden relative">
        {/* Webcam component */}
        {!error && (
          <Webcam
            key={key}
            ref={webcamRef}
            audio={false}
            videoConstraints={videoConstraints}
            onUserMedia={handleWebcamStart}
            onUserMediaError={handleWebcamError}
            className="w-full h-full object-cover"
            mirrored={true}
            screenshotFormat="image/jpeg"
            style={{ display: isVideoOn ? 'block' : 'none' }}
          />
        )}
        
        {isStarting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gray-900/80">
            <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-white text-lg">Starting camera...</p>
          </div>
        )}
        
        {error && !isStarting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gray-900/90">
            <VideoOff className="w-16 h-16 text-red-400 mb-4" />
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={retryCamera}
              className="mt-4 px-6 py-3 bg-pink-500 text-white text-lg rounded-full hover:bg-pink-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {!isVideoOn && !isStarting && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gray-900">
            <VideoOff className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-400 text-lg mb-4">Camera is off</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-pink-500 text-white text-lg rounded-full hover:bg-pink-600 transition-colors"
            >
              Start Camera
            </button>
          </div>
        )}
      </div>
      
      {/* Video Controls */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={toggleCamera}
          disabled={isStarting}
          className={`p-4 rounded-full transition-colors ${
            isVideoOn 
              ? 'bg-gray-200 hover:bg-gray-300' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          } ${isStarting ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default VideoFeed;
