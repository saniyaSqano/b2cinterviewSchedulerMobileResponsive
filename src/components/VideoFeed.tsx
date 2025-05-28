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
  const [rearCameraId, setRearCameraId] = useState<string | null>(null);

  // Notify parent component when video status changes
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(isVideoOn);
    }
  }, [isVideoOn, onStatusChange]);

  // Handle webcam errors
  const handleWebcamError = useCallback((err: string | DOMException) => {
    console.error('Webcam error:', err);
    const errorMessage = err instanceof DOMException ? err.message : String(err);
    setError(`Unable to access camera: ${errorMessage}`);
    setIsVideoOn(false);
    setIsStarting(false);
  }, []);

  // Handle successful webcam start
  const handleWebcamStart = useCallback(() => {
    console.log('Camera started successfully');
    
    // Get information about the camera being used
    if (webcamRef.current && webcamRef.current.stream) {
      const videoTracks = webcamRef.current.stream.getVideoTracks();
      if (videoTracks.length > 0) {
        console.log('Camera info:', videoTracks[0].label);
        console.log('Camera settings:', videoTracks[0].getSettings());
      }
    }
    
    setIsVideoOn(true);
    setIsStarting(false);
    setError(null);
  }, []);

  // Find rear camera by enumerating devices
  const findRearCamera = useCallback(async () => {
    try {
      // Request permission first
      const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately after getting permission
      initialStream.getTracks().forEach(track => track.stop());
      
      // Now enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log('Available video devices:', videoDevices);
      
      if (videoDevices.length === 0) {
        throw new Error('No video devices found');
      }
      
      // Try to find rear camera by label
      let rearCamera = videoDevices.find(device => {
        const label = device.label.toLowerCase();
        return label.includes('back') || label.includes('rear') || label.includes('environment');
      });
      
      // If no camera with rear/back in the name, and we have multiple cameras,
      // use the last one (often the rear camera)
      if (!rearCamera && videoDevices.length > 1) {
        rearCamera = videoDevices[videoDevices.length - 1];
      }
      
      // If we still don't have a camera, use the first one
      if (!rearCamera && videoDevices.length > 0) {
        rearCamera = videoDevices[0];
      }
      
      if (rearCamera) {
        console.log('Selected camera:', rearCamera.label);
        return rearCamera.deviceId;
      }
      
      return null;
    } catch (error) {
      console.error('Error finding rear camera:', error);
      return null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    
    try {
      // If we don't have a rear camera ID yet, try to find one
      if (!rearCameraId) {
        const deviceId = await findRearCamera();
        if (deviceId) {
          setRearCameraId(deviceId);
        }
      }
      
      // Force remount of webcam component
      setKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Error starting camera:', error);
      setError('Failed to start camera');
      setIsStarting(false);
    }
  }, [rearCameraId, findRearCamera]);

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
    // Reset rear camera ID to force a new search
    setRearCameraId(null);
    startCamera();
  }, [startCamera]);

  // Auto-start camera on component mount
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  // Determine video constraints based on whether we have a rear camera ID
  const videoConstraints = rearCameraId
    ? {
        width: 1280,
        height: 720,
        deviceId: { exact: rearCameraId }
      }
    : {
        width: 1280,
        height: 720,
        facingMode: { exact: "environment" }
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
            mirrored={false} // Never mirror to ensure rear camera displays correctly
            screenshotFormat="image/jpeg"
            style={{ display: isVideoOn ? 'block' : 'none', transform: 'scaleX(-1)' }} // Flip horizontally to correct orientation
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
