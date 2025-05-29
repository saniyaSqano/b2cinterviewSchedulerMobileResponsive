import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Video, VideoOff } from 'lucide-react';
import Webcam from 'react-webcam';

interface VideoFeedProps {
  onStatusChange?: (isVideoOn: boolean) => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
  faceDetectionVideoRef?: React.RefObject<HTMLVideoElement>;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ onStatusChange, videoRef, faceDetectionVideoRef }) => {
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
      
      // Notify parent component about status change with the stream
      if (onStatusChange) {
        // We need to call this first to ensure the parent knows the camera is on
        onStatusChange(true);
      }
      
      // Connect to external videoRef if provided
      if (videoRef && videoRef.current) {
        console.log('Connecting webcam stream to main video element');
        videoRef.current.srcObject = webcamRef.current.stream;
      }
      
      // Connect to face detection videoRef if provided
      if (faceDetectionVideoRef && faceDetectionVideoRef.current) {
        console.log('Connecting webcam stream to face detection video element');
        faceDetectionVideoRef.current.srcObject = webcamRef.current.stream;
        faceDetectionVideoRef.current.muted = true; // Ensure it's muted
        faceDetectionVideoRef.current.setAttribute('playsinline', ''); // Ensure it plays inline
        
        // Attempt to play the video
        const playPromise = faceDetectionVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Face detection video playing successfully');
          }).catch(err => {
            console.error('Error playing face detection video:', err);
            // Try again with user interaction
            const retryPlay = () => {
              if (faceDetectionVideoRef.current) {
                faceDetectionVideoRef.current.play()
                  .then(() => console.log('Face detection video playing after retry'))
                  .catch(e => console.error('Still failed to play video:', e));
              }
            };
            
            // Add event listener to document for user interaction
            document.addEventListener('click', retryPlay, { once: true });
          });
        }
      }
    }
    
    setIsVideoOn(true);
    setIsStarting(false);
    setError(null);
  }, [videoRef, faceDetectionVideoRef]);

  // Find rear camera by enumerating devices
  const findRearCamera = async () => {
    try {
      setError(null);
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log('Available video devices:', videoDevices);
      
      if (videoDevices.length === 0) {
        throw new Error('No video devices found');
      }
      
      // Try to find a rear camera by looking at the label
      let rearCamera = videoDevices.find(device => {
        const label = device.label.toLowerCase();
        return label.includes('back') || label.includes('rear') || label.includes('environment');
      });
      
      // If no rear camera is explicitly labeled, use the last camera in the list
      // (often the rear camera on mobile devices)
      if (!rearCamera && videoDevices.length > 1) {
        rearCamera = videoDevices[videoDevices.length - 1];
      } else if (!rearCamera) {
        // If only one camera is available, use that one
        rearCamera = videoDevices[0];
      }
      
      console.log('Selected camera:', rearCamera);
      setRearCameraId(rearCamera.deviceId);
      return rearCamera.deviceId;
    } catch (err) {
      console.error('Error finding rear camera:', err);
      setError('Failed to find camera devices. Please check permissions.');
      return null;
    }
  };

  const startCamera = useCallback(async () => {
    setIsStarting(true);
    setError(null);

    try {
      // Try multiple approaches to get the camera working
      // First try to enumerate devices and get specific camera
      try {
        await findRearCamera();
      } catch (err) {
        console.warn('Could not enumerate devices:', err);
        // Continue anyway, we'll try with default constraints
      }
      
      // Set video on - the Webcam component will handle the actual camera initialization
      setIsVideoOn(true);
      
    } catch (err) {
      console.error('Error starting camera:', err);
      setError('Failed to start camera. Please check permissions and try again.');
      setIsVideoOn(false);
    } finally {
      setIsStarting(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera');
    
    // Explicitly stop all tracks in the webcam stream
    if (webcamRef.current && webcamRef.current.stream) {
      const tracks = webcamRef.current.stream.getTracks();
      tracks.forEach(track => {
        console.log('Explicitly stopping track:', track.kind);
        track.stop();
      });
      
      // Clear the stream reference
      webcamRef.current.stream = null;
    }
    
    setIsVideoOn(false);
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

  // Auto-start camera on component mount and cleanup on unmount
  useEffect(() => {
    startCamera();
    
    // Cleanup function to ensure camera is stopped when component unmounts
    return () => {
      console.log('VideoFeed component unmounting, stopping camera');
      if (webcamRef.current && webcamRef.current.stream) {
        const tracks = webcamRef.current.stream.getTracks();
        tracks.forEach(track => {
          console.log('Stopping track on unmount:', track.kind);
          track.stop();
        });
      }
    };
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
        {isVideoOn && (
          <Webcam
            ref={webcamRef}
            key={key}
            videoConstraints={
              rearCameraId
                ? { deviceId: rearCameraId } // Use deviceId without 'exact' to be more flexible
                : { facingMode: { ideal: 'environment' } } // Use 'ideal' instead of requiring it
            }
            audio={false}
            onUserMediaError={(err) => {
              console.error('Webcam error:', err);
              // Handle both string and DOMException error types
              const errorName = typeof err === 'string' ? err : err.name;
              setError(`Webcam error: ${errorName}`);
              
              // If we get an error with the current constraints, try with minimal constraints
              if (typeof err !== 'string' && err.name === 'OverconstrainedError') {
                console.log('Trying with minimal constraints');
                setRearCameraId(null);
                setKey(prevKey => prevKey + 1);
              } else {
                setIsVideoOn(false);
              }
            }}
            className="w-full h-full object-cover"
            mirrored={false} // Never mirror to ensure rear camera displays correctly
            screenshotFormat="image/jpeg"
            style={{ display: isVideoOn ? 'block' : 'none' }} // Don't flip horizontally to prevent overlap
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
