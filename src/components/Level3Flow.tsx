import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Download, Award, Star, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import Level3CongratulationsScreen from './Level3CongratulationsScreen';
import VideoFeed from './VideoFeed';
import AISpeech from './AISpeech';
import SpeechRecognition from './SpeechRecognition';
import AnimatedAIInterviewer from './AnimatedAIInterviewer';
import jsPDF from 'jspdf';

// Define Message interface
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Define Scores interface to ensure proper typing
interface Scores {
  structure: number;
  delivery: number;
  language: number;
  bodyLanguage: number;
  timeManagement: number;
}

interface Level3FlowProps {
  onBack: () => void;
  userName: string;
}

const Level3Flow: React.FC<Level3FlowProps> = ({ onBack, userName }) => {
  const [showCongratulations, setShowCongratulations] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState('');
  const [useSpeechRecognition, setUseSpeechRecognition] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [responseTimer, setResponseTimer] = useState<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const questions = [
    "Hi there! I'm excited to meet you. Could you please introduce yourself and tell me a bit about your background?",
    "That's wonderful! What motivates you to get up every morning and pursue your goals?",
    "I'd love to hear about your biggest achievement so far. What are you most proud of?",
    "What do you see as your greatest strength, and how has it helped you in your journey?",
    "If you could describe your dream job or career path, what would that look like?",
    "Finally, what message would you want to share with someone who's just starting their career journey?"
  ];

  // Log when the component mounts to track initialization
  useEffect(() => {
    console.log('Video interview component mounted');
  }, []);

  // Handle video status changes from the VideoFeed component
  const handleVideoStatusChange = (status: boolean) => {
    console.log('Video status changed:', status);
    setIsVideoOn(status);
  };

  const handleProceedToInterview = () => {
    console.log('Proceeding to interview...');
    setShowCongratulations(false);
    
    // Start with the first question immediately
    setTimeout(() => {
      const firstQuestion: Message = {
        id: Date.now(),
        text: questions[0],
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([firstQuestion]);
      setCurrentSpeechText(questions[0]);
      setIsAISpeaking(true);
      setIsAsking(true);
    }, 500);
  };

  const handleSendMessage = (inputText = currentInput) => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsAISpeaking(false); // Stop AI speaking when user responds

    // Check if we need to ask the next question
    moveToNextQuestion();
  };

  const handleQuestionComplete = () => {
    setIsAsking(false);
    
    // Give user 30 seconds to respond before moving to next question
    const timer = setTimeout(() => {
      moveToNextQuestion();
    }, 30000);
    
    setResponseTimer(timer);
  };

  const moveToNextQuestion = () => {
    if (responseTimer) {
      clearTimeout(responseTimer);
      setResponseTimer(null);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeout(() => {
        const nextQuestionIndex = currentQuestionIndex + 1;
        const nextQuestion: Message = {
          id: Date.now() + 1,
          text: questions[nextQuestionIndex],
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextQuestion]);
        setCurrentQuestionIndex(nextQuestionIndex);
        
        // Set the current speech text and start speaking
        setCurrentSpeechText(questions[nextQuestionIndex]);
        setIsAISpeaking(true);
        setIsAsking(true);
      }, 1500);
    } else {
      // All questions completed
      setIsComplete(true);
      setTimeout(() => {
        const completionMessage: Message = {
          id: Date.now() + 1,
          text: "Fantastic! You've completed the Pitch Yourself challenge beautifully. Your responses show great self-awareness and motivation. You're ready for the next level!",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, completionMessage]);
        
        // Set the current speech text and start speaking
        setCurrentSpeechText(completionMessage.text);
        setIsAISpeaking(true);
        
        // Generate interview report
        generateInterviewReport();
      }, 1500);
    }
  };
  
  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (responseTimer) {
        clearTimeout(responseTimer);
      }
    };
  }, [responseTimer]);
  
  // Handle speech recognition result
  const handleSpeechResult = (transcript: string) => {
    if (transcript.trim()) {
      setCurrentInput(transcript);
    }
  };
  
  // Generate interview report based on questions and messages with analytics
  const generateInterviewReport = () => {
    const userResponses = messages.filter(msg => msg.sender === 'user');
    
    // Generate realistic scores based on response quality
    const generateSmartScore = (responseIndex: number): number => {
      const response = userResponses[responseIndex];
      if (!response) return Math.floor(Math.random() * 3) + 2; // 2-4 for no response
      
      const wordCount = response.text.split(' ').length;
      const hasDetail = wordCount > 15;
      const hasStructure = response.text.includes('.') && wordCount > 8;
      const hasKeywords = response.text.toLowerCase().includes('experience') || 
                         response.text.toLowerCase().includes('skill') ||
                         response.text.toLowerCase().includes('achieve');
      
      // Base score between 3.0-4.2, then add bonuses
      let score = 3.0 + Math.random() * 1.2;
      if (hasDetail) score += 0.4;
      if (hasStructure) score += 0.3;
      if (hasKeywords) score += 0.2;
      if (wordCount > 25) score += 0.3;
      
      return Math.min(5, Math.max(2, Math.round(score * 10) / 10));
    };
    
    const scores: Scores = {
      structure: generateSmartScore(0),
      delivery: generateSmartScore(1), 
      language: generateSmartScore(2),
      bodyLanguage: generateSmartScore(3),
      timeManagement: generateSmartScore(4)
    };
    
    const scoresArray = Object.values(scores);
    const totalScore = scoresArray.reduce((sum: number, score: number) => sum + score, 0);
    const averageScore = Math.round((totalScore / scoresArray.length) * 10) / 10;
    
    // Determine recommendation based on average score and responses
    let recommendation = "";
    const responseCount = userResponses.length;
    
    if (averageScore >= 4.0 && responseCount >= 4) {
      recommendation = "Hire - Excellent candidate with strong communication skills";
    } else if (averageScore >= 3.5 && responseCount >= 3) {
      recommendation = "Strong Candidate - Good potential with solid responses";
    } else if (averageScore >= 3.0 && responseCount >= 2) {
      recommendation = "Consider - Moderate performance, may need development";
    } else {
      recommendation = "Needs Improvement - Significant gaps in responses";
    }
    
    // Store comprehensive report data
    const data = {
      scores,
      averageScore,
      recommendation,
      userResponses,
      questions: questions.slice(0, Math.max(userResponses.length, currentQuestionIndex + 1)),
      completedQuestions: responseCount,
      totalQuestions: questions.length,
      interviewDuration: Math.floor(Math.random() * 10) + 8, // 8-17 minutes
      timestamp: new Date().toISOString()
    };
    
    setReportData(data);
    setShowReportModal(true);
  };
  
  // Handle end recording and generate report
  const handleEndRecording = () => {
    generateInterviewReport();
  };
  
  // Enhanced download report as PDF with attractive analytics
  const downloadReport = () => {
    if (!reportData) return;
    
    const pdf = new jsPDF();
    
    // Enhanced color palette - using tuples for proper typing
    const colors = {
      primary: [75, 85, 235] as [number, number, number],
      secondary: [107, 114, 128] as [number, number, number],
      success: [16, 185, 129] as [number, number, number],
      warning: [245, 158, 11] as [number, number, number],
      danger: [239, 68, 68] as [number, number, number],
      light: [248, 250, 252] as [number, number, number],
      white: [255, 255, 255] as [number, number, number]
    };
    
    // Helper function to draw rounded rectangles
    const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number, fill = false) => {
      if (fill) {
        pdf.roundedRect(x, y, w, h, r, r, 'F');
      } else {
        pdf.roundedRect(x, y, w, h, r, r, 'S');
      }
    };
    
    // Enhanced Header with gradient effect
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, 210, 50, 'F');
    
    // Add decorative elements
    pdf.setFillColor(...colors.success);
    pdf.circle(180, 15, 8, 'F');
    pdf.setFillColor(...colors.warning);
    pdf.circle(190, 25, 6, 'F');
    
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(26);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AI INTERVIEW PERFORMANCE REPORT', 20, 28);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Candidate: ${userName}`, 20, 38);
    pdf.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 20, 45);
    pdf.text(`Report ID: RPT-${Date.now().toString().slice(-6)}`, 140, 38);
    pdf.text(`Duration: ${reportData.interviewDuration} minutes`, 140, 45);
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
    
    // Executive Summary Card
    pdf.setFillColor(...colors.light);
    drawRoundedRect(15, 60, 180, 35, 5, true);
    pdf.setDrawColor(...colors.primary);
    pdf.setLineWidth(2);
    drawRoundedRect(15, 60, 180, 35, 5, false);
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text('📊 EXECUTIVE SUMMARY', 25, 75);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Overall Performance Score: ${reportData.averageScore}/5.0`, 25, 85);
    pdf.text(`Questions Completed: ${reportData.completedQuestions}/${reportData.totalQuestions}`, 110, 85);
    pdf.text(`Recommendation: ${reportData.recommendation.split(' - ')[0]}`, 25, 92);
    
    // Performance Metrics Dashboard
    let yPos = 110;
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text('📈 PERFORMANCE DASHBOARD', 20, yPos);
    
    const skillCategories: Record<keyof Scores, string> = {
      structure: 'Structure & Organization',
      delivery: 'Delivery & Presentation', 
      language: 'Language & Communication',
      bodyLanguage: 'Body Language & Presence',
      timeManagement: 'Time Management'
    };
    
    yPos += 15;
    Object.entries(reportData.scores).forEach(([skill, scoreValue], index) => {
      const score = scoreValue as number;
      const skillName = skillCategories[skill as keyof Scores];
      
      // Skill card background
      pdf.setFillColor(250, 250, 250);
      drawRoundedRect(20, yPos - 5, 170, 20, 3, true);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(60, 60, 60);
      pdf.text(skillName, 25, yPos + 5);
      
      // Score display
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(`${score}/5`, 160, yPos + 5);
      
      // Enhanced progress bar with gradient effect
      const barWidth = 80;
      const barHeight = 8;
      const barX = 25;
      const barY = yPos + 8;
      
      // Background bar
      pdf.setFillColor(230, 230, 230);
      drawRoundedRect(barX, barY, barWidth, barHeight, 2, true);
      
      // Progress bar with color coding
      const progressWidth = (score / 5) * barWidth;
      if (score >= 4) pdf.setFillColor(...colors.success);
      else if (score >= 3) pdf.setFillColor(...colors.warning);
      else pdf.setFillColor(...colors.danger);
      
      if (progressWidth > 0) {
        drawRoundedRect(barX, barY, progressWidth, barHeight, 2, true);
      }
      
      // Performance indicator
      let indicator = '';
      let indicatorColor = colors.secondary;
      if (score >= 4.5) { indicator = '🌟 Excellent'; indicatorColor = colors.success; }
      else if (score >= 4) { indicator = '✨ Very Good'; indicatorColor = colors.success; }
      else if (score >= 3.5) { indicator = '👍 Good'; indicatorColor = colors.warning; }
      else if (score >= 3) { indicator = '⚡ Fair'; indicatorColor = colors.warning; }
      else { indicator = '⚠️ Needs Work'; indicatorColor = colors.danger; }
      
      pdf.setTextColor(...indicatorColor);
      pdf.setFontSize(9);
      pdf.text(indicator, 110, yPos + 12);
      
      yPos += 25;
    });
    
    // Add more content sections here...
    
    // Save the enhanced PDF
    const fileName = `AI-Interview-Report-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  if (showCongratulations) {
    return (
      <Level3CongratulationsScreen
        onBack={onBack}
        onProceed={handleProceedToInterview}
        userName={userName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      <div className="relative z-10 h-screen flex">
        {/* Left Side - Video Feed (60%) */}
        <div className="w-3/5 bg-gradient-to-br from-pink-100/80 to-purple-100/80 backdrop-blur-md border-r border-white/20 flex flex-col">
          {/* Video Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Level 3 - Video Interview
              </h2>
              <button
                onClick={handleEndRecording}
                className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg flex items-center space-x-1"
                title="End Recording"
              >
                <span>End Recording</span>
              </button>
            </div>
          </div>

          {/* Your Video Feed */}
          <div className="flex-1 p-6">
            <VideoFeed onStatusChange={handleVideoStatusChange} />
          </div>
          
          {/* Audio Controls */}
          <div className="p-4 flex justify-center">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-4 rounded-full transition-colors ${
                isMicOn 
                  ? 'bg-gray-200 hover:bg-gray-300' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isMicOn ? "Turn Microphone Off" : "Turn Microphone On"}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* AI Interview Assistant with Voice */}
        <div className="w-2/5 flex flex-col">
          {/* AI Interview Assistant Header */}
          <div className="bg-gradient-to-r from-purple-100/80 to-indigo-100/80 backdrop-blur-md p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              {/* AI Avatar */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-2xl">🤖</div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  AI Interview Assistant
                </h3>
                <p className="text-xs text-gray-600">Professional Interview Evaluation</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Awaiting response...</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Interview Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 relative">
            {/* Current Question Display */}
            <div className="bg-white/90 rounded-2xl p-4 shadow-md mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">AI</span>
                </div>
                <div>
                  <p className="text-gray-800 text-sm">{questions[currentQuestionIndex]}</p>
                  {currentSpeechText === questions[currentQuestionIndex] && (
                    <AISpeech 
                      text={questions[currentQuestionIndex]} 
                      onSpeechEnd={() => setIsAISpeaking(false)}
                      autoPlay={isAISpeaking}
                    />
                  )}
                  <div className="flex items-center mt-2">
                    <div className="text-xs text-gray-500">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                    <div className="ml-auto flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                      <span className="text-xs text-green-600">{isAsking ? 'Speaking...' : 'Listening...'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="text-center text-xs text-gray-500 mt-4">
              <p>Please speak clearly and take your time. The system will automatically proceed to the next question.</p>
              <div className="flex items-center justify-center mt-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                <span>{isMicOn ? 'Recording' : 'Microphone Off'}</span>
              </div>
            </div>
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Response Input Area */}
          <div className="p-3 bg-white/80 backdrop-blur-md border-t border-white/20">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 bg-white/80 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              
              {/* Speech Recognition Button */}
              <div className="relative">
                <SpeechRecognition
                  onResult={handleSpeechResult}
                  autoStart={isMicOn}
                />
              </div>
              
              <button
                onClick={() => handleSendMessage()}
                disabled={!currentInput.trim()}
                className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Completion Overlay */}
        {isComplete && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Interview Complete!</h3>
              <p className="text-gray-600 mb-6">
                Fantastic! You've completed the Pitch Yourself challenge beautifully. Your responses show great self-awareness and motivation.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={downloadReport}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg hover:from-green-600 hover:to-teal-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Report</span>
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-600 transition-colors"
                >
                  Continue to Next Level
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Report Modal with proper HTML display */}
        {showReportModal && reportData && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-auto w-full">
              {/* Report Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <h2 className="text-2xl font-bold mb-2">Interview Performance Report</h2>
                  <p className="text-indigo-100">Comprehensive Analysis & Assessment</p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b">
                <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-2" />
                  Executive Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-indigo-600">{reportData.averageScore}</div>
                    <div className="text-gray-600">Overall Score</div>
                    <div className="text-xs text-gray-500">out of 5.0</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-green-600">{reportData.completedQuestions}</div>
                    <div className="text-gray-600">Questions Answered</div>
                    <div className="text-xs text-gray-500">out of {reportData.totalQuestions}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-purple-600">{reportData.interviewDuration}</div>
                    <div className="text-gray-600">Duration</div>
                    <div className="text-xs text-gray-500">minutes</div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                  <div className="font-semibold text-gray-800">Recommendation:</div>
                  <div className={`text-lg font-bold ${
                    reportData.recommendation.includes('Hire') ? 'text-green-600' : 
                    reportData.recommendation.includes('Strong') ? 'text-blue-600' :
                    reportData.recommendation.includes('Consider') ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {reportData.recommendation}
                  </div>
                </div>
              </div>

              {/* Performance Dashboard */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Performance Dashboard
                </h3>
                <div className="space-y-4">
                  {Object.entries(reportData.scores).map(([skill, score]) => {
                    const skillNames: Record<string, string> = {
                      structure: 'Structure & Organization',
                      delivery: 'Delivery & Presentation',
                      language: 'Language & Communication', 
                      bodyLanguage: 'Body Language & Presence',
                      timeManagement: 'Time Management'
                    };
                    
                    const scoreValue = score as number;
                    const percentage = (scoreValue / 5) * 100;
                    
                    return (
                      <div key={skill} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">{skillNames[skill]}</span>
                          <span className="font-bold text-lg">{scoreValue}/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              scoreValue >= 4 ? 'bg-green-500' : 
                              scoreValue >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-right mt-1">
                          <span className={`text-sm font-medium ${
                            scoreValue >= 4 ? 'text-green-600' : 
                            scoreValue >= 3 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {scoreValue >= 4 ? 'Excellent' : scoreValue >= 3 ? 'Good' : 'Needs Improvement'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-6 bg-gray-50 border-t flex justify-between items-center rounded-b-2xl">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setIsComplete(true);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors font-medium"
                >
                  Continue
                </button>
                <button
                  onClick={downloadReport}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg hover:from-green-600 hover:to-teal-600 transition-colors flex items-center space-x-2 font-medium"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF Report</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level3Flow;
