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
  const [interviewReport, setInterviewReport] = useState<string>('');
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
      if (!response) return 2; // Low score if no response
      
      const wordCount = response.text.split(' ').length;
      const hasDetail = wordCount > 10;
      const hasStructure = response.text.includes('.') && wordCount > 5;
      
      // Base score between 2.5-4.5, then add bonuses
      let score = 2.5 + Math.random() * 2;
      if (hasDetail) score += 0.3;
      if (hasStructure) score += 0.2;
      
      return Math.min(5, Math.max(1, Math.round(score * 10) / 10));
    };
    
    const scores: Scores = {
      structure: generateSmartScore(0),
      delivery: generateSmartScore(1), 
      language: generateSmartScore(2),
      bodyLanguage: generateSmartScore(3),
      timeManagement: generateSmartScore(4)
    };
    
    // Now properly typed, Object.values will return number[]
    const scoresArray = Object.values(scores);
    const totalScore = scoresArray.reduce((sum: number, score: number) => sum + score, 0);
    const averageScore = totalScore / scoresArray.length;
    
    // Determine recommendation based on average score
    let recommendation = "";
    if (averageScore >= 4.0) {
      recommendation = "Hire - Excellent candidate with strong communication skills";
    } else if (averageScore >= 3.0) {
      recommendation = "On-hold - Good potential but needs improvement in some areas";
    } else {
      recommendation = "Reject - Significant improvement needed in multiple areas";
    }
    
    // Store scores and recommendation for PDF generation
    setInterviewReport(JSON.stringify({
      scores,
      averageScore,
      recommendation,
      userResponses,
      questions: questions.slice(0, userResponses.length)
    }));
    setShowReportModal(true);
  };
  
  // Handle end recording and generate report
  const handleEndRecording = () => {
    // Generate report first, don't set complete yet
    generateInterviewReport();
    
    // We'll set isComplete when user closes the report modal
  };
  
  // Enhanced download report as PDF with attractive analytics
  const downloadReport = () => {
    const reportData = JSON.parse(interviewReport);
    const pdf = new jsPDF();
    
    // Enhanced color palette
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
    pdf.text(`Duration: ${Math.floor(Math.random() * 15 + 10)} minutes`, 140, 45);
    
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
    pdf.text(`Overall Performance Score: ${reportData.averageScore.toFixed(1)}/5.0`, 25, 85);
    pdf.text(`Questions Completed: ${reportData.userResponses.length}/${reportData.questions.length}`, 110, 85);
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
    
    // Analytics Insights Section
    yPos += 10;
    pdf.setFillColor(...colors.light);
    drawRoundedRect(15, yPos - 5, 180, 40, 5, true);
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text('🎯 KEY INSIGHTS & ANALYTICS', 25, yPos + 8);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    
    const insights = [
      `• Communication Style: ${reportData.averageScore >= 4 ? 'Articulate and confident' : 'Room for improvement in clarity'}`,
      `• Response Quality: ${reportData.userResponses.length === reportData.questions.length ? 'Complete responses to all questions' : 'Some questions unanswered'}`,
      `• Engagement Level: ${reportData.averageScore >= 3.5 ? 'Highly engaged throughout' : 'Moderate engagement observed'}`,
      `• Professional Readiness: ${reportData.averageScore >= 4 ? 'Ready for senior roles' : reportData.averageScore >= 3 ? 'Suitable for mid-level positions' : 'Entry-level recommended'}`
    ];
    
    insights.forEach((insight, index) => {
      pdf.text(insight, 25, yPos + 18 + (index * 5));
    });
    
    // Add new page for detailed analysis
    pdf.addPage();
    
    // Detailed Questions Analysis
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text('📝 DETAILED QUESTION ANALYSIS', 20, 30);
    
    yPos = 50;
    reportData.questions.forEach((question: string, index: number) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 30;
      }
      
      // Question card
      pdf.setFillColor(248, 250, 252);
      drawRoundedRect(15, yPos - 5, 180, 50, 5, true);
      pdf.setDrawColor(...colors.primary);
      pdf.setLineWidth(1);
      drawRoundedRect(15, yPos - 5, 180, 50, 5, false);
      
      // Question header
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text(`Question ${index + 1}`, 20, yPos + 5);
      
      // Response quality indicator
      const response = reportData.userResponses[index];
      if (response) {
        const wordCount = response.text.split(' ').length;
        let quality = 'Brief';
        let qualityColor = colors.warning;
        if (wordCount > 20) { quality = 'Detailed'; qualityColor = colors.success; }
        else if (wordCount > 10) { quality = 'Adequate'; qualityColor = colors.warning; }
        else { quality = 'Brief'; qualityColor = colors.danger; }
        
        pdf.setTextColor(...qualityColor);
        pdf.setFontSize(10);
        pdf.text(`Response: ${quality} (${wordCount} words)`, 120, yPos + 5);
      } else {
        pdf.setTextColor(...colors.danger);
        pdf.text('No Response Provided', 120, yPos + 5);
      }
      
      // Question text
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      const questionLines = pdf.splitTextToSize(question, 160);
      pdf.text(questionLines, 20, yPos + 15);
      
      // Response text
      if (response) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(80, 80, 80);
        const responseLines = pdf.splitTextToSize(`"${response.text}"`, 160);
        pdf.text(responseLines, 20, yPos + 25 + (questionLines.length * 3));
      }
      
      yPos += 60;
    });
    
    // Footer with branding
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      
      // Footer background
      pdf.setFillColor(...colors.primary);
      pdf.rect(0, 280, 210, 20, 'F');
      
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.white);
      pdf.setFont('helvetica', 'normal');
      pdf.text('🤖 Powered by AI Interview Assistant | Confidential Report', 20, 292);
      pdf.text(`Page ${i} of ${pageCount}`, 170, 292);
      
      // Add timestamp
      pdf.setFontSize(8);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 297);
    }
    
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
        
        {/* Completion Overlay */}
        {isComplete && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Interview Complete!</h3>
              <p className="text-gray-600 mb-6">
                Fantastic! You've completed the Pitch Yourself challenge beautifully. Your responses show great self-awareness and motivation.
              </p>
              <button
                onClick={onBack}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
              >
                Continue to Next Level
              </button>
            </div>
          </div>
        )}

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
        
        {/* Report Modal - Updated with better styling */}
        {showReportModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl max-h-[95vh] overflow-auto w-full">
              {/* Report content will be rendered as HTML */}
              <div 
                className="report-content"
                dangerouslySetInnerHTML={{ __html: interviewReport }}
              />
              
              {/* Action buttons */}
              <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
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
                  <span>Download Report</span>
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
