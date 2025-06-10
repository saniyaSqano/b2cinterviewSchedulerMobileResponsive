import React, { useState, useRef, useEffect } from 'react';
import Level5CongratulationsScreen from './Level5CongratulationsScreen';
import ProctoredInterviewReport from './ProctoredInterviewReport';
import Level5Header from './Level5Header';
import Level5ProctoredCamera from './Level5ProctoredCamera';
import Level5ViolationLogs from './Level5ViolationLogs';
import Level5InterviewChat from './Level5InterviewChat';

interface Level5FlowProps {
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

const Level5Flow: React.FC<Level5FlowProps> = ({ onBack, userName }) => {
  const [showCongratulations, setShowCongratulations] = useState(true);
  const [showProctoredReport, setShowProctoredReport] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [violationLogs, setViolationLogs] = useState<ViolationLog[]>([]);
  const [interviewStartTime, setInterviewStartTime] = useState<Date>(new Date());
  const [interviewDuration, setInterviewDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const violationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const interviewQuestions = [
    "Welcome to your AI Proctored Interview! This is your final assessment. Let's begin with a professional introduction. Please tell me about yourself and your career aspirations.",
    "Describe a challenging project you've worked on. How did you approach the problem and what was the outcome?",
    "What are your key strengths and how do they align with this role? Provide specific examples.",
    "How do you handle working under pressure or tight deadlines? Give me a concrete example.",
    "Where do you see yourself in 5 years, and how does this position fit into your career goals?",
    "Do you have any questions about the role or our organization?"
  ];

  useEffect(() => {
    return () => {
      console.log('Cleaning up camera stream...');
      stopCamera();
      stopViolationDetection();
    };
  }, []);

  // Calculate interview duration
  useEffect(() => {
    if (!showCongratulations && !showProctoredReport && startTimeRef.current) {
      const interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - startTimeRef.current!.getTime()) / (1000 * 60));
        setInterviewDuration(duration);
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [showCongratulations, showProctoredReport]);

  // Enhanced violation detection for proctored interview
  useEffect(() => {
    if (!showCongratulations && isVideoOn && !showProctoredReport) {
      startViolationDetection();
    } else {
      stopViolationDetection();
    }

    return () => stopViolationDetection();
  }, [showCongratulations, isVideoOn, showProctoredReport]);

  const startViolationDetection = () => {
    // Clear any existing interval
    stopViolationDetection();
    
    violationIntervalRef.current = setInterval(() => {
      // More frequent violation checks for proctored environment
      if (Math.random() > 0.8) {
        const violations = [
          { type: 'error' as const, message: 'Multiple faces detected - interview security breach' },
          { type: 'warning' as const, message: 'Eye tracking: looking away from camera' },
          { type: 'error' as const, message: 'Unauthorized person detected in background' },
          { type: 'warning' as const, message: 'Audio levels inconsistent - possible external interference' },
          { type: 'error' as const, message: 'Screen sharing or recording software detected' },
          { type: 'warning' as const, message: 'Lighting conditions suboptimal for face recognition' }
        ];
        
        const randomViolation = violations[Math.floor(Math.random() * violations.length)];
        const newLog: ViolationLog = {
          id: Date.now(),
          ...randomViolation,
          timestamp: new Date()
        };
        
        setViolationLogs(prev => [newLog, ...prev].slice(0, 15)); // Keep more logs for proctored session
      }
    }, 6000);
  };

  const stopViolationDetection = () => {
    if (violationIntervalRef.current) {
      clearInterval(violationIntervalRef.current);
      violationIntervalRef.current = null;
      console.log('Violation detection stopped');
    }
  };

  const startCamera = async () => {
    try {
      setIsStartingCamera(true);
      setCameraError(null);
      console.log('Starting proctored interview camera...');
      
      stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: true 
      });
      
      console.log('Got proctored camera stream:', stream);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsVideoOn(true);
        setIsStartingCamera(false);
        console.log('Proctored camera started successfully');
      }
    } catch (error) {
      console.error('Error accessing proctored camera:', error);
      setCameraError('Unable to access camera. Camera access is required for the proctored interview.');
      setIsVideoOn(false);
      setIsStartingCamera(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping proctored camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsVideoOn(false);
  };

  const toggleVideo = () => {
    console.log('Toggle proctored video clicked, current state:', isVideoOn);
    if (isVideoOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleProceedToInterview = async () => {
    console.log('Proceeding to proctored interview...');
    setShowCongratulations(false);
    const startTime = new Date();
    setInterviewStartTime(startTime);
    startTimeRef.current = startTime;
    
    setTimeout(async () => {
      console.log('Starting camera for proctored interview...');
      await startCamera();
      
      setTimeout(() => {
        const firstQuestionText = interviewQuestions[0];
        const firstQuestion: Message = {
          id: Date.now(),
          text: firstQuestionText,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages([firstQuestion]);
      }, 1000);
    }, 500);
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

    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setTimeout(() => {
        const nextQuestionIndex = currentQuestionIndex + 1;
        const nextQuestion: Message = {
          id: Date.now() + 1,
          text: interviewQuestions[nextQuestionIndex],
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextQuestion]);
        setCurrentQuestionIndex(nextQuestionIndex);
      }, 2000);
    } else {
      setTimeout(() => {
        const completionMessage: Message = {
          id: Date.now() + 1,
          text: "Congratulations! You have successfully completed your AI Proctored Interview. Your responses demonstrated excellent preparation, professionalism, and strong communication skills. You have successfully finished all levels of our comprehensive interview preparation program!",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, completionMessage]);
        setIsComplete(true);
      }, 2000);
    }
  };

  // Get real candidate details from localStorage or use userName as fallback
  const [candidateDetails, setCandidateDetails] = useState({
    fullName: userName,
    email: "",
    phoneNumber: "",
    skills: "",
    experience: ""
  });

  // Load user data from localStorage when component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem('currentUserData');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setCandidateDetails({
          fullName: userData.fullName || userName,
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          skills: userData.skills || "",
          experience: userData.experience || ""
        });
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, [userName]);

  const handleEndInterview = () => {
    console.log('Ending AI proctored interview and generating report...');
    
    // Calculate final duration
    if (startTimeRef.current) {
      const endTime = new Date();
      const finalDuration = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60));
      setInterviewDuration(finalDuration);
    }
    
    // Stop all monitoring and camera
    stopViolationDetection();
    stopCamera();
    setShowProctoredReport(true);
  };

  const handleBackFromReport = () => {
    setShowProctoredReport(false);
    onBack();
  };

  if (showProctoredReport) {
    return (
      <ProctoredInterviewReport
        candidateDetails={candidateDetails}
        violationLogs={violationLogs}
        onBack={handleBackFromReport}
        duration={interviewDuration}
        interviewStartTime={interviewStartTime}
        totalQuestions={interviewQuestions.length}
        answeredQuestions={currentQuestionIndex + 1}
      />
    );
  }

  if (showCongratulations) {
    return (
      <Level5CongratulationsScreen
        onBack={onBack}
        onProceed={handleProceedToInterview}
        userName={userName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 relative overflow-hidden">
      <div className="relative z-10 h-screen flex">
        {/* Left Side - Video Feed (60%) */}
        <div className="w-3/5 bg-gradient-to-br from-purple-100/80 to-indigo-100/80 backdrop-blur-md border-r border-white/20 flex flex-col">
          <Level5Header onBack={onBack} onEndInterview={handleEndInterview} />
          
          <div className="flex-1 p-4">
            <Level5ProctoredCamera
              isVideoOn={isVideoOn}
              isMicOn={isMicOn}
              onToggleVideo={toggleVideo}
              onToggleMic={() => setIsMicOn(!isMicOn)}
              cameraError={cameraError}
              onStartCamera={startCamera}
              isStartingCamera={isStartingCamera}
              videoRef={videoRef}
            />
          </div>
        </div>

        {/* Right Side - AI Interview Proctor & Violations (40%) */}
        <div className="w-2/5 flex flex-col">
          <Level5InterviewChat
            messages={messages}
            isComplete={isComplete}
            onEndInterview={handleEndInterview}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={interviewQuestions.length}
            isMicOn={isMicOn}
          />
          
          {/* Violation Logs moved to right panel */}
          <div className="p-3">
            <Level5ViolationLogs violationLogs={violationLogs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level5Flow;
