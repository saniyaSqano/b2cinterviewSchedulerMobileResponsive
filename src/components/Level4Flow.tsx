import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, Shield, AlertTriangle, CheckCircle, X, Volume2, Volume1, VolumeX, Usb, LogOut } from 'lucide-react';
import Level4CongratulationsScreen from './Level4CongratulationsScreen';
import VideoFeed from './VideoFeed';
import AISpeech from './AISpeech';
import InterviewReport from './InterviewReport';
import { initFaceDetection, detectFaces } from '../utils/faceDetection';
import { initNoiseDetection, startNoiseDetection } from '../utils/noiseDetection';
import { initDeviceDetection, checkForNewDevices, requestUSBDeviceAccess } from '../utils/deviceDetection';

interface Level4FlowProps {
  onBack: () => void;
  userName: string;
}

interface ViolationLog {
  id: number;
  type: 'warning' | 'error';
  message: string;
  timestamp: Date;
}

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

const Level4Flow: React.FC<Level4FlowProps> = ({ onBack, userName }) => {
  const [showCongratulations, setShowCongratulations] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [violationLogs, setViolationLogs] = useState<ViolationLog[]>([]);
  const [isFaceDetectionActive, setIsFaceDetectionActive] = useState(false);
  const [isNoiseDetectionActive, setIsNoiseDetectionActive] = useState(false);
  const [lastFaceDetectionTime, setLastFaceDetectionTime] = useState(0);
  const [lastNoiseDetectionTime, setLastNoiseDetectionTime] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [backgroundNoiseDetected, setBackgroundNoiseDetected] = useState(false);
  const [interviewerNoiseDetected, setInterviewerNoiseDetected] = useState(false);
  const [isDeviceDetectionActive, setIsDeviceDetectionActive] = useState(false);
  const [newDeviceDetected, setNewDeviceDetected] = useState(false);
  const [lastDeviceCheckTime, setLastDeviceCheckTime] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState('');
  const [showReport, setShowReport] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceDetectionVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceDetectionIntervalRef = useRef<number | null>(null);
  const noiseDetectionStopRef = useRef<(() => void) | null>(null);
  const deviceDetectionIntervalRef = useRef<number | null>(null);

  const practiceQuestions = [
    "Welcome to your self-practice session! Let's start with a warm-up. Tell me about yourself and what brings you here today.",
    "Great! Now, describe a challenging situation you've faced and how you overcame it.",
    "What are your greatest strengths and how do they help you in professional settings?",
    "Where do you see yourself in the next 5 years?",
    "What questions do you have for me about this role or our company?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize face detection, noise detection, and device detection when component mounts
  useEffect(() => {
    const loadDetectionSystems = async () => {
      try {
        // Initialize face detection
        await initFaceDetection();
        console.log('Face detection initialized successfully');
        
        // Initialize noise detection
        await initNoiseDetection();
        console.log('Noise detection initialized successfully');
        
        // Initialize device detection
        await initDeviceDetection();
        console.log('Device detection initialized successfully');
        
        // Request USB access on initialization
        // Note: This will only work when triggered by a user gesture
        // We'll add a button for this later if needed
      } catch (error) {
        console.error('Failed to initialize detection systems:', error);
      }
    };

    loadDetectionSystems();
  }, []);

  // Face detection methods
  const startFaceDetection = () => {
    if (faceDetectionIntervalRef.current) {
      clearInterval(faceDetectionIntervalRef.current);
    }

    // Check if video element is ready
    if (!faceDetectionVideoRef.current || !faceDetectionVideoRef.current.srcObject) {
      console.error('Face detection video element not ready or no srcObject');
      
      // Try to get the stream from the webcam if available
      if (streamRef.current) {
        console.log('Attempting to use existing stream reference');
        faceDetectionVideoRef.current.srcObject = streamRef.current;
        faceDetectionVideoRef.current.play()
          .then(() => console.log('Video playing from stream reference'))
          .catch(err => console.error('Failed to play video from stream reference:', err));
      } else {
        return; // Exit if no stream is available
      }
    }

    setIsFaceDetectionActive(true);
    console.log('Starting face detection monitoring with video:', {
      width: faceDetectionVideoRef.current.videoWidth,
      height: faceDetectionVideoRef.current.videoHeight,
      readyState: faceDetectionVideoRef.current.readyState,
      srcObject: faceDetectionVideoRef.current.srcObject ? 'Present' : 'None'
    });
    
    // Run face detection every 2 seconds
    faceDetectionIntervalRef.current = window.setInterval(async () => {
      if (!faceDetectionVideoRef.current || !isVideoOn) {
        console.warn('Video not available for face detection');
        return;
      }
      
      // Ensure video is playing
      if (faceDetectionVideoRef.current.paused) {
        try {
          await faceDetectionVideoRef.current.play();
          console.log('Resumed video playback for face detection');
        } catch (err) {
          console.error('Failed to play video for face detection:', err);
          return;
        }
      }
      
      try {
        console.log('Running face detection check...');
        const result = await detectFaces(faceDetectionVideoRef.current);
        const currentTime = Date.now();
        
        // Only add violation logs if enough time has passed since the last one (5 seconds)
        if (currentTime - lastFaceDetectionTime > 5000) {
          if (result.noFaceDetected) {
            // Add violation for no face detected
            const newLog: ViolationLog = {
              id: Date.now(),
              type: 'error',
              message: 'No face detected in frame',
              timestamp: new Date()
            };
            setViolationLogs(prev => [newLog, ...prev].slice(0, 10));
            setLastFaceDetectionTime(currentTime);
          } else if (result.multipleFacesDetected) {
            // Add violation for multiple faces detected
            const newLog: ViolationLog = {
              id: Date.now(),
              type: 'error',
              message: `Multiple faces detected (${result.faceCount})`,
              timestamp: new Date()
            };
            setViolationLogs(prev => [newLog, ...prev].slice(0, 10));
            setLastFaceDetectionTime(currentTime);
          }
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    }, 2000);
  };

  const stopFaceDetection = () => {
    if (faceDetectionIntervalRef.current) {
      clearInterval(faceDetectionIntervalRef.current);
      faceDetectionIntervalRef.current = null;
    }
    setIsFaceDetectionActive(false);
    console.log('Stopped face detection monitoring');
  };
  
  // Noise detection methods
  const startNoiseMonitoring = () => {
    if (noiseDetectionStopRef.current) {
      noiseDetectionStopRef.current();
      noiseDetectionStopRef.current = null;
    }
    
    if (!streamRef.current) {
      console.error('No audio stream available for noise detection');
      return;
    }
    
    setIsNoiseDetectionActive(true);
    console.log('Starting noise detection monitoring');
    
    // Start noise detection with the audio stream
    noiseDetectionStopRef.current = startNoiseDetection(
      streamRef.current,
      (result) => {
        // Update state with noise detection results
        setNoiseLevel(result.noiseLevel);
        setBackgroundNoiseDetected(result.backgroundNoiseDetected);
        setInterviewerNoiseDetected(result.interviewerNoiseDetected);
        
        const currentTime = Date.now();
        
        // Only add violation logs if enough time has passed since the last one (5 seconds)
        if (currentTime - lastNoiseDetectionTime > 5000) {
          // Check for background noise
          if (result.backgroundNoiseDetected) {
            const newLog: ViolationLog = {
              id: Date.now(),
              type: 'warning',
              message: `Background noise detected (${result.noiseLevel}% level)`,
              timestamp: new Date()
            };
            setViolationLogs(prev => [newLog, ...prev].slice(0, 10));
            setLastNoiseDetectionTime(currentTime);
          } 
          // Check for interviewer noise
          else if (result.interviewerNoiseDetected) {
            const newLog: ViolationLog = {
              id: Date.now(),
              type: 'warning',
              message: 'Other person speaking in background',
              timestamp: new Date()
            };
            setViolationLogs(prev => [newLog, ...prev].slice(0, 10));
            setLastNoiseDetectionTime(currentTime);
          }
          // Check for poor signal-to-noise ratio
          else if (result.signalToNoiseRatio < 5 && result.noiseLevel > 40) {
            const newLog: ViolationLog = {
              id: Date.now(),
              type: 'warning',
              message: 'Poor audio quality detected',
              timestamp: new Date()
            };
            setViolationLogs(prev => [newLog, ...prev].slice(0, 10));
            setLastNoiseDetectionTime(currentTime);
          }
        }
      }
    );
  };
  
  const stopNoiseMonitoring = () => {
    if (noiseDetectionStopRef.current) {
      noiseDetectionStopRef.current();
      noiseDetectionStopRef.current = null;
    }
    setIsNoiseDetectionActive(false);
    console.log('Stopped noise detection monitoring');
  };
  
  // Device detection methods
  const startDeviceMonitoring = () => {
    if (deviceDetectionIntervalRef.current) {
      clearInterval(deviceDetectionIntervalRef.current);
      deviceDetectionIntervalRef.current = null;
    }
    
    setIsDeviceDetectionActive(true);
    setNewDeviceDetected(false);
    console.log('Starting device detection monitoring');
    
    // Check for new devices every 5 seconds
    deviceDetectionIntervalRef.current = window.setInterval(async () => {
      try {
        const result = await checkForNewDevices();
        console.log('Device check result:', result);
        
        if (result.newDevicesDetected) {
          setNewDeviceDetected(true);
          
          const currentTime = Date.now();
          
          // Only add violation logs if enough time has passed since the last one (10 seconds)
          if (currentTime - lastDeviceCheckTime > 10000) {
            // Create a violation log for each detected device
            result.recentlyConnectedDevices.forEach(device => {
              const newLog: ViolationLog = {
                id: Date.now() + Math.random(),
                type: 'error',
                message: `New device connected: ${device.name || device.type}`,
                timestamp: new Date()
              };
              setViolationLogs(prev => [newLog, ...prev].slice(0, 10));
            });
            
            // If no specific devices were identified but we detected a change
            if (result.recentlyConnectedDevices.length === 0) {
              const newLog: ViolationLog = {
                id: Date.now(),
                type: 'error',
                message: 'External device connection detected',
                timestamp: new Date()
              };
              setViolationLogs(prev => [newLog, ...prev].slice(0, 10));
            }
            
            setLastDeviceCheckTime(currentTime);
          }
        }
      } catch (error) {
        console.error('Error checking for devices:', error);
      }
    }, 5000);
  };
  
  const stopDeviceMonitoring = () => {
    if (deviceDetectionIntervalRef.current) {
      clearInterval(deviceDetectionIntervalRef.current);
      deviceDetectionIntervalRef.current = null;
    }
    setIsDeviceDetectionActive(false);
    console.log('Stopped device detection monitoring');
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up resources...');
      // Stop face detection
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
      }
      
      // Stop noise detection
      if (noiseDetectionStopRef.current) {
        noiseDetectionStopRef.current();
      }
      
      // Stop device detection
      if (deviceDetectionIntervalRef.current) {
        clearInterval(deviceDetectionIntervalRef.current);
      }
      
      // Release media streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Manual function to connect the webcam stream to the face detection video element
  const connectStreamToFaceDetection = (stream: MediaStream | null) => {
    if (!stream) {
      console.error('No stream available to connect to face detection');
      return;
    }

    if (faceDetectionVideoRef.current) {
      console.log('Manually connecting stream to face detection video element');
      faceDetectionVideoRef.current.srcObject = stream;
      faceDetectionVideoRef.current.muted = true;
      faceDetectionVideoRef.current.setAttribute('playsinline', '');
      
      faceDetectionVideoRef.current.play()
        .then(() => {
          console.log('Face detection video playing successfully');
          // Start face detection after video is playing
          startFaceDetection();
        })
        .catch(err => {
          console.error('Error playing face detection video:', err);
        });
    }
  };

  // Start/stop detection systems based on camera status
  useEffect(() => {
    console.log('Video status changed:', { isVideoOn });
    
    // Add a small delay to ensure video is ready
    if (isVideoOn) {
      const timer = setTimeout(() => {
        console.log('Attempting to connect stream after delay');
        
        // Try to get the stream from the video element if it exists
        if (videoRef.current && videoRef.current.srcObject) {
          connectStreamToFaceDetection(videoRef.current.srcObject as MediaStream);
        } else {
          console.warn('Video element not ready yet, trying to get stream from webcam');
          
          // Try to get the user media directly
          navigator.mediaDevices.getUserMedia({ video: true, audio: true }) // Request audio too
            .then(stream => {
              connectStreamToFaceDetection(stream);
              // Store the stream reference
              streamRef.current = stream;
              
              // If mic is on, start noise detection
              if (isMicOn) {
                startNoiseMonitoring();
              }
              
              // Start device detection monitoring
              startDeviceMonitoring();
              
              // Request USB device access (will only work on user gesture)
              // We'll add a button for this if needed
              requestUSBDeviceAccess().then(granted => {
                console.log('USB access granted:', granted);
              }).catch(err => {
                console.warn('USB access request error:', err);
              });
            })
            .catch(err => {
              console.error('Failed to get user media for detection:', err);
            });
        }
      }, 3000); // 3 second delay to ensure video is initialized
      
      return () => {
        clearTimeout(timer);
        stopFaceDetection();
        stopNoiseMonitoring();
        stopDeviceMonitoring();
      };
    } else {
      stopFaceDetection();
      stopNoiseMonitoring();
      stopDeviceMonitoring();
    }
  }, [isVideoOn]);

  // Start/stop noise detection based on microphone status
  useEffect(() => {
    console.log('Microphone status changed:', { isMicOn });
    
    if (isMicOn) {
      // Start noise detection
      startNoiseMonitoring();
    } else {
      // Stop noise detection
      stopNoiseMonitoring();
    }
  }, [isMicOn]);

  // Add additional random violations (besides face detection)
  useEffect(() => {
    if (!showCongratulations && isVideoOn) {
      const interval = setInterval(() => {
        // Randomly add violation logs for other types of violations
        if (Math.random() > 0.85) {
          const violations = [
            { type: 'warning' as const, message: 'Looking away from camera detected' },
            { type: 'warning' as const, message: 'Audio levels inconsistent' },
            { type: 'warning' as const, message: 'Poor lighting conditions' }
          ];
          
          const randomViolation = violations[Math.floor(Math.random() * violations.length)];
          const newLog: ViolationLog = {
            id: Date.now(),
            ...randomViolation,
            timestamp: new Date()
          };
          
          setViolationLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep only last 10 logs
        }
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [showCongratulations, isVideoOn]);

  // We don't need the toggleVideo function anymore as the VideoFeed component handles this internally

  const handleProceedToPractice = async () => {
    console.log('Proceeding to practice session...');
    setShowCongratulations(false);
    setShowReport(false);
    
    // VideoFeed component will automatically start the camera
    setTimeout(() => {
      console.log('Starting practice session...');
      
      // Set video status to on to trigger violation detection
      setIsVideoOn(true);
      
      // Display the first question
      const firstQuestionText = practiceQuestions[0];
      const firstQuestion: Message = {
        id: Date.now(),
        text: firstQuestionText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([firstQuestion]);
      
      // Set the current speech text for the AI to speak
      setCurrentSpeechText(firstQuestionText);
      setIsAISpeaking(true);
    }, 1000);
  };

  const handleEndSession = () => {
    console.log('Ending practice session...');
    
    // Stop all detection systems
    stopFaceDetection();
    stopNoiseMonitoring();
    stopDeviceMonitoring();
    
    // Close the camera stream
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    
    // Turn off video state
    setIsVideoOn(false);
    
    // Show the report
    setShowReport(true);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');

    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setTimeout(() => {
        const nextQuestionIndex = currentQuestionIndex + 1;
        const nextQuestionText = practiceQuestions[nextQuestionIndex];
        const nextQuestion: Message = {
          id: Date.now() + 1,
          text: nextQuestionText,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextQuestion]);
        setCurrentQuestionIndex(nextQuestionIndex);
        
        // Set the current speech text for the AI to speak
        setCurrentSpeechText(nextQuestionText);
        setIsAISpeaking(true);
      }, 1500);
    } else {
      setTimeout(() => {
        const completionText = "Excellent work! You've completed your self-practice session. Your responses show great preparation and confidence. You're ready for the proctored interview!";
        const completionMessage: Message = {
          id: Date.now() + 1,
          text: completionText,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, completionMessage]);
        setIsComplete(true);
        
        // Set the current speech text for the AI to speak
        setCurrentSpeechText(completionText);
        setIsAISpeaking(true);
      }, 1500);
    }
  };

  if (showCongratulations) {
    return (
      <Level4CongratulationsScreen
        onBack={onBack}
        onProceed={handleProceedToPractice}
        userName={userName}
      />
    );
  }

  if (showReport) {
    // Mock candidate details and skill assessment for demonstration
    const candidateDetails = {
      fullName: userName,
      email: "candidate@example.com",
      phoneNumber: "+1 (555) 123-4567",
      skills: "React, TypeScript, Node.js, Python",
      experience: "3+ years in full-stack development"
    };

    const skillAssessment = {
      programming: 85,
      framework: 78,
      testing: 72,
      confidence: 80,
      leadership: 75,
      communication: 82,
      adaptability: 79
    };

    return (
      <InterviewReport
        candidateDetails={candidateDetails}
        skillAssessment={skillAssessment}
        violationLogs={violationLogs}
        onBack={handleProceedToPractice}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <div className="relative z-10 h-screen flex">
        {/* Left Side - Video Feed and Violations (60%) */}
        <div className="w-3/5 bg-gradient-to-br from-indigo-100/80 to-blue-100/80 backdrop-blur-md border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">Self-Practice Interview</h2>
              <div className="w-10"></div> {/* Empty div for spacing */}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Video Feed */}
            <div className="bg-black rounded-xl overflow-hidden shadow-lg relative mb-4">
              <h3 className="absolute top-4 left-4 text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">
                Your Video
              </h3>
              
              {cameraError ? (
                <div className="h-96 flex items-center justify-center bg-gray-900 text-center p-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <VideoOff className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-white text-sm mb-4">{cameraError}</p>
                    <button
                      onClick={() => setCameraError(null)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <VideoFeed
                  onStatusChange={(status) => setIsVideoOn(status)}
                  videoRef={videoRef}
                  faceDetectionVideoRef={faceDetectionVideoRef}
                />
              )}
              
              {/* Hidden video element for face detection */}
              <video
                ref={faceDetectionVideoRef}
                style={{ display: 'none' }}
              />
              
              {/* Hidden AI Speech component for background speech */}
              {!isComplete && (
                <div className="hidden">
                  <AISpeech 
                    text={currentSpeechText} 
                    onSpeechEnd={() => setIsAISpeaking(false)}
                    autoPlay={isAISpeaking}
                  />
                </div>
              )}
              
              {/* Additional Controls - Positioned at the bottom of video feed */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-4">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-full transition-colors shadow-lg ${
                    isMicOn 
                      ? 'bg-gray-200 hover:bg-gray-300' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Just the video feed on the left side - no duplicated UI elements */}

          </div>
        </div>

        {/* Right Side - AI Interview Coach (40%) */}
        <div className="w-2/5 flex flex-col">
          {/* AI Coach Header */}
          <div className="bg-gradient-to-r from-indigo-100/80 to-blue-100/80 backdrop-blur-md p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold">AI</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">AI Practice Coach</h3>
                  <p className="text-xs text-gray-600">Your interview companion</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                </div>
              </div>
              
              {/* End Session Button */}
              <button
                onClick={handleEndSession}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center space-x-1 text-sm shadow-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>End Session</span>
              </button>
            </div>
          </div>

          {/* Current Question Display - Prominently shown at the top */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 m-3 p-5 rounded-xl shadow-lg border border-indigo-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold">Q{Math.min(currentQuestionIndex + 1, practiceQuestions.length)}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-bold text-indigo-800">Question {Math.min(currentQuestionIndex + 1, practiceQuestions.length)} of {practiceQuestions.length}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">
                  {messages.length > 0 && messages[messages.length - 1].sender === 'ai' ? 
                    messages[messages.length - 1].text : 
                    'Loading question...'}
                </p>
                
                {/* AI Speech Controls */}
                {messages.length > 0 && messages[messages.length - 1].sender === 'ai' && (
                  <div className="mt-3">
                    <AISpeech 
                      text={currentSpeechText} 
                      onSpeechEnd={() => setIsAISpeaking(false)}
                      autoPlay={isAISpeaking}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Previous Responses Section */}
          <div className="flex-1 overflow-y-auto mx-3 mb-3">
            {messages.filter(m => m.sender === 'user').length > 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Your Previous Responses
                </h3>
                <div className="space-y-3">
                  {messages.filter(m => m.sender === 'user').map((message, idx) => (
                    <div key={message.id} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-indigo-700">Response {idx + 1}</span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{message.text}</p>
                      <div className="mt-2 flex items-center">
                        <span className="text-xs text-gray-500 italic">
                          {message.text.split(' ').length} words
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md flex flex-col items-center justify-center h-48">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-center">Your responses will appear here after you answer the question.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Voice Response Indicator */}
          {!isComplete && (
            <div className="bg-white/90 rounded-2xl m-3 p-4 shadow-lg border border-indigo-100">
              <div className="flex items-center justify-center space-x-3">
                <div className={`p-2 rounded-full ${isMicOn ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Mic className={`w-5 h-5 ${isMicOn ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-gray-700">Your Response</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {isMicOn ? 'Microphone active - speak your response' : 'Microphone is off - turn it on to respond'}
                  </p>
                  
                  {/* Noise level indicator */}
                  {isMicOn && isNoiseDetectionActive && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        {/* Audio quality icon */}
                        {noiseLevel < 30 ? (
                          <Volume1 className="w-3 h-3 text-green-500" />
                        ) : noiseLevel < 70 ? (
                          <Volume2 className="w-3 h-3 text-yellow-500" />
                        ) : (
                          <VolumeX className="w-3 h-3 text-red-500" />
                        )}
                        
                        {/* Noise level bar */}
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              noiseLevel < 30 ? 'bg-green-500' : 
                              noiseLevel < 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, noiseLevel)}%` }}
                          ></div>
                        </div>
                        
                        {/* Status text */}
                        <span className="text-xs">
                          {backgroundNoiseDetected ? 'Background noise' : 
                           interviewerNoiseDetected ? 'Other speaker' : 
                           noiseLevel < 30 ? 'Good audio' : 
                           noiseLevel < 70 ? 'Moderate noise' : 'High noise'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Device detection indicator */}
                  {isDeviceDetectionActive && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        {/* Device status icon */}
                        <Usb className={`w-3 h-3 ${newDeviceDetected ? 'text-red-500' : 'text-green-500'}`} />
                        
                        {/* Device status bar */}
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${newDeviceDetected ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: newDeviceDetected ? '100%' : '20%' }}
                          ></div>
                        </div>
                        
                        {/* Status text */}
                        <span className="text-xs font-medium" style={{ color: newDeviceDetected ? '#ef4444' : '#10b981' }}>
                          {newDeviceDetected ? 'USB storage device detected!' : 'No USB storage devices'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Violation Logs - Bottom section */}
          <div className="bg-white/90 rounded-2xl m-3 p-4 shadow-lg border border-indigo-100">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-semibold text-gray-700">Violation Logs</h3>
            </div>
            <div className="h-24 overflow-y-auto space-y-1">
              {violationLogs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">No violations detected</span>
                </div>
              ) : (
                violationLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start space-x-2 p-2 rounded-lg ${
                      log.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                    }`}
                  >
                    <AlertTriangle className={`w-3 h-3 mt-0.5 ${
                      log.type === 'error' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${
                        log.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                      }`}>
                        {log.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completion Area */}
          {isComplete && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 p-3">
              <div className="text-center">
                <p className="text-green-800 font-semibold mb-2 text-sm">Level 4 Complete! 🎉</p>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg text-sm"
                >
                  Continue to Next Level
                </button>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full px-2 py-1 shadow-lg">
            <p className="text-xs font-medium text-gray-700">
              Question {Math.min(currentQuestionIndex + 1, practiceQuestions.length)} of {practiceQuestions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level4Flow;
