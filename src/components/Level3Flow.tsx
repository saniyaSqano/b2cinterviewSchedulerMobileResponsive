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
  
  // Download report as PDF
  const downloadReport = () => {
    const reportData = JSON.parse(interviewReport);
    const pdf = new jsPDF();
    
    // Set up colors as tuples to avoid spread operator issues
    const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo
    const secondaryColor: [number, number, number] = [107, 114, 128]; // Gray
    const accentColor: [number, number, number] = [34, 197, 94]; // Green
    
    // Header
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Interview Performance Report', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Candidate: ${userName}`, 20, 32);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 140, 32);
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
    
    // Overall Score Section
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Overall Performance', 20, 60);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Overall Score: ${reportData.averageScore.toFixed(1)}/5.0`, 20, 75);
    pdf.text(`Questions Answered: ${reportData.userResponses.length}/${reportData.questions.length}`, 20, 85);
    pdf.text(`Interview Duration: ${Math.floor(Math.random() * 15 + 10)} minutes`, 20, 95);
    
    // Performance Breakdown
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Performance Breakdown', 20, 115);
    
    const skillCategories: Record<keyof Scores, string> = {
      structure: 'Structure & Organization',
      delivery: 'Delivery & Presentation', 
      language: 'Language & Communication',
      bodyLanguage: 'Body Language & Presence',
      timeManagement: 'Time Management'
    };
    
    let yPosition = 130;
    Object.entries(reportData.scores).forEach(([skill, score]) => {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${skillCategories[skill as keyof Scores]}: ${score}/5`, 25, yPosition);
      
      // Draw progress bar
      pdf.setFillColor(230, 230, 230);
      pdf.rect(120, yPosition - 4, 60, 6, 'F');
      
      const barWidth = (score / 5) * 60;
      if (score >= 4) pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      else if (score >= 3) pdf.setFillColor(234, 179, 8);
      else pdf.setFillColor(239, 68, 68);
      
      pdf.rect(120, yPosition - 4, barWidth, 6, 'F');
      
      yPosition += 15;
    });
    
    // Recommendation
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Final Recommendation', 20, yPosition + 15);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const recommendationLines = pdf.splitTextToSize(reportData.recommendation, 170);
    pdf.text(recommendationLines, 20, yPosition + 30);
    
    // Questions and Responses
    yPosition += 50;
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Interview Questions & Responses', 20, yPosition);
    yPosition += 15;
    
    reportData.questions.forEach((question: string, index: number) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Question
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Q${index + 1}: `, 20, yPosition);
      
      pdf.setFont('helvetica', 'normal');
      const questionLines = pdf.splitTextToSize(question, 160);
      pdf.text(questionLines, 35, yPosition);
      yPosition += questionLines.length * 5 + 5;
      
      // Response
      if (reportData.userResponses[index]) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Response: ', 20, yPosition);
        
        pdf.setFont('helvetica', 'normal');
        const responseLines = pdf.splitTextToSize(reportData.userResponses[index].text, 160);
        pdf.text(responseLines, 20, yPosition + 8);
        yPosition += responseLines.length * 5 + 15;
      } else {
        pdf.setFont('helvetica', 'italic');
        pdf.text('No response recorded', 20, yPosition);
        yPosition += 15;
      }
    });
    
    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.text('Generated by AI Interview Assistant', 20, 285);
      pdf.text(`Page ${i} of ${pageCount}`, 170, 285);
    }
    
    // Save the PDF
    pdf.save(`interview-report-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
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
