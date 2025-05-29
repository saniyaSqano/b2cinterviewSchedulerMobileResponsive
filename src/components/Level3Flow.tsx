import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Download, Award, Star, TrendingUp, Clock, MessageSquare, Link, ExternalLink } from 'lucide-react';
import Level3CongratulationsScreen from './Level3CongratulationsScreen';
import VideoFeed from './VideoFeed';
import AISpeech from './AISpeech';
import SpeechRecognition from './SpeechRecognition';
import AnimatedAIInterviewer from './AnimatedAIInterviewer';
import jsPDF from 'jspdf';
import { uploadToS3, getSignedDownloadUrl } from '../utils/s3Service';

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
  const [reportS3Url, setReportS3Url] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
  
  // Automatically upload report to S3 when report modal is displayed
  useEffect(() => {
    if (showReportModal && reportData && !reportS3Url && !isUploading) {
      // Automatically start the upload process
      (async () => {
        try {
          console.log('Auto-uploading report to S3...');
          await generateAndUploadReport();
        } catch (error) {
          console.error('Error auto-uploading report to S3:', error);
        }
      })();
    }
  }, [showReportModal, reportData, reportS3Url, isUploading]);

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
  
  // Handle end recording, generate report, and upload to S3
  const handleEndRecording = () => {
    generateInterviewReport();
    // Report will be automatically uploaded to S3 when the modal opens
  };
  
  // Generate PDF and upload to S3
  const generateAndUploadReport = async () => {
    if (!reportData) return null;
    
    try {
      setIsUploading(true);
      setUploadError(null);
      
      // Create a new jsPDF instance with portrait orientation
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Define colors for the report
      const colors = {
        primary: [75, 85, 235], // Indigo blue
        secondary: [107, 114, 128], // Gray
        success: [16, 185, 129], // Green
        warning: [245, 158, 11], // Orange
        danger: [239, 68, 68], // Red
        light: [248, 250, 252], // Light gray
        white: [255, 255, 255] // White
      };
      
      // Header section
      pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.text('AI INTERVIEW PERFORMANCE REPORT', 105, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Candidate: ${userName}`, 15, 30);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 150, 30);
      
      // Executive Summary
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.text('Executive Summary', 15, 50);
      
      pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.setLineWidth(0.5);
      pdf.line(15, 52, 195, 52);
      
      pdf.setFontSize(12);
      pdf.text(`Overall Score: ${reportData.averageScore}/5.0`, 15, 60);
      pdf.text(`Questions Completed: ${reportData.completedQuestions}/${reportData.totalQuestions}`, 15, 67);
      pdf.text(`Interview Duration: ${reportData.interviewDuration} minutes`, 15, 74);
      
      // Recommendation box
      pdf.setFillColor(245, 245, 250);
      pdf.roundedRect(15, 80, 180, 20, 3, 3, 'F');
      
      pdf.setFontSize(11);
      pdf.text('Recommendation:', 20, 90);
      
      // Set color based on recommendation
      if (reportData.recommendation.includes('Hire')) {
        pdf.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
      } else if (reportData.recommendation.includes('Strong')) {
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      } else if (reportData.recommendation.includes('Consider')) {
        pdf.setTextColor(colors.warning[0], colors.warning[1], colors.warning[2]);
      } else {
        pdf.setTextColor(colors.danger[0], colors.danger[1], colors.danger[2]);
      }
      
      pdf.setFontSize(12);
      pdf.text(reportData.recommendation, 20, 95);
      pdf.setTextColor(0, 0, 0);
      
      // Performance Dashboard
      pdf.setFontSize(16);
      pdf.text('Performance Dashboard', 15, 110);
      
      pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.line(15, 112, 195, 112);
      
      // Skill categories with proper labels
      const skillCategories: Record<keyof Scores, string> = {
        structure: 'Structure & Content',
        delivery: 'Delivery & Engagement', 
        language: 'Language & Tone',
        bodyLanguage: 'Body Language & Presence',
        timeManagement: 'Time Management'
      };
      
      // Draw performance metrics
      let yPos = 120;
      Object.entries(reportData.scores).forEach(([skill, scoreValue]) => {
        const score = scoreValue as number;
        const skillName = skillCategories[skill as keyof Scores];
        
        // Skill name
        pdf.setFontSize(11);
        pdf.text(skillName, 15, yPos);
        
        // Score text
        pdf.text(`${score}/5`, 180, yPos, { align: 'right' });
        
        // Background bar
        pdf.setFillColor(230, 230, 230);
        pdf.rect(15, yPos + 2, 160, 5, 'F');
        
        // Progress bar with color coding
        const progressWidth = (score / 5) * 160;
        
        if (score >= 4) {
          pdf.setFillColor(colors.success[0], colors.success[1], colors.success[2]);
        } else if (score >= 3) {
          pdf.setFillColor(colors.warning[0], colors.warning[1], colors.warning[2]);
        } else {
          pdf.setFillColor(colors.danger[0], colors.danger[1], colors.danger[2]);
        }
        
        pdf.rect(15, yPos + 2, progressWidth, 5, 'F');
        
        yPos += 15;
      });
      
      // Questions and Responses
      yPos += 10;
      pdf.setFontSize(16);
      pdf.text('Interview Questions & Responses', 15, yPos);
      
      pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.line(15, yPos + 2, 195, yPos + 2);
      
      yPos += 10;
      
      // Add each question and response
      reportData.questions.forEach((question: string, index: number) => {
        // Check if we need a new page
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setFontSize(11);
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.text(`Question ${index + 1}:`, 15, yPos);
        
        yPos += 6;
        pdf.setTextColor(0, 0, 0);
        pdf.text(question, 15, yPos, { maxWidth: 180 });
        
        // Calculate text height based on content length and width
        const textLines = pdf.splitTextToSize(question, 180);
        yPos += textLines.length * 5;
        
        // Find corresponding response
        const response = reportData.userResponses[index];
        
        pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        pdf.text('Response:', 15, yPos);
        
        yPos += 6;
        pdf.setTextColor(0, 0, 0);
        
        if (response) {
          const responseText = pdf.splitTextToSize(response.text, 180);
          pdf.text(responseText, 15, yPos);
          yPos += responseText.length * 5 + 5;
        } else {
          pdf.text('No response recorded', 15, yPos);
          yPos += 10;
        }
        
        // Add some spacing between Q&A pairs
        yPos += 5;
      });
      
      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      pdf.text('Report generated by AI Interview Assistant', 105, 285, { align: 'center' });
      
      // Generate PDF as blob
      const pdfBlob = pdf.output('blob');
      const fileName = `Interview-Report-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Upload to S3
      console.log('Uploading PDF to S3...');
      const s3Url = await uploadToS3(pdfBlob, fileName, 'application/pdf');
      console.log('PDF uploaded to S3:', s3Url);
      
      setReportS3Url(s3Url);
      setIsUploading(false);
      return s3Url;
      
    } catch (error) {
      console.error('Error generating and uploading PDF report:', error);
      setUploadError('Failed to upload report. Please try again.');
      setIsUploading(false);
      return null;
    }
  };
  
  // Handle report download - either from S3 or generate locally
  const downloadReport = async () => {
    try {
      // Try to generate and upload the report to S3 first
      setIsUploading(true);
      
      try {
        // If we already have a report URL, use it
        if (reportS3Url) {
          window.open(reportS3Url, '_blank');
          setIsUploading(false);
          return;
        }
        
        // Otherwise generate and upload the report
        const url = await generateAndUploadReport();
        
        if (url) {
          window.open(url, '_blank');
          setIsUploading(false);
          return;
        }
      } catch (s3Error) {
        console.error('Error with S3 download, falling back to local:', s3Error);
        // Fall back to local download if S3 fails
        downloadLocalPdf();
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setUploadError('Failed to download report. Please try again.');
      setIsUploading(false);
      // Try local download as a final fallback
      downloadLocalPdf();
    }
  };
  
  // Generate a local PDF download as fallback
  const downloadLocalPdf = () => {
    if (!reportData) return;
    
    try {
      console.log('Generating local PDF download...');
      
      // Create a new jsPDF instance with portrait orientation
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Define colors for the report
      const colors = {
        primary: [75, 85, 235], // Indigo blue
        secondary: [107, 114, 128], // Gray
        success: [16, 185, 129], // Green
        warning: [245, 158, 11], // Orange
        danger: [239, 68, 68], // Red
        light: [248, 250, 252], // Light gray
        white: [255, 255, 255] // White
      };
      
      // Header section
      pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.text('AI INTERVIEW PERFORMANCE REPORT', 105, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Candidate: ${userName}`, 15, 30);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 150, 30);
      
      // Executive Summary
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.text('Executive Summary', 15, 50);
      
      pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.setLineWidth(0.5);
      pdf.line(15, 52, 195, 52);
      
      pdf.setFontSize(12);
      pdf.text(`Overall Score: ${reportData.averageScore}/5.0`, 15, 60);
      pdf.text(`Questions Completed: ${reportData.completedQuestions}/${reportData.totalQuestions}`, 15, 67);
      pdf.text(`Interview Duration: ${reportData.interviewDuration} minutes`, 15, 74);
      
      // Recommendation box
      pdf.setFillColor(245, 245, 250);
      pdf.roundedRect(15, 80, 180, 20, 3, 3, 'F');
      
      pdf.setFontSize(11);
      pdf.text('Recommendation:', 20, 90);
      
      // Set color based on recommendation
      if (reportData.recommendation.includes('Hire')) {
        pdf.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
      } else if (reportData.recommendation.includes('Strong')) {
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      } else if (reportData.recommendation.includes('Consider')) {
        pdf.setTextColor(colors.warning[0], colors.warning[1], colors.warning[2]);
      } else {
        pdf.setTextColor(colors.danger[0], colors.danger[1], colors.danger[2]);
      }
      
      pdf.setFontSize(12);
      pdf.text(reportData.recommendation, 20, 95);
      pdf.setTextColor(0, 0, 0);
      
      // Performance Dashboard
      pdf.setFontSize(16);
      pdf.text('Performance Dashboard', 15, 110);
      
      pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.line(15, 112, 195, 112);
      
      // Skill categories with proper labels
      const skillCategories = {
        structure: 'Structure & Content',
        delivery: 'Delivery & Engagement', 
        language: 'Language & Tone',
        bodyLanguage: 'Body Language & Presence',
        timeManagement: 'Time Management'
      };
      
      // Draw performance metrics
      let yPos = 120;
      Object.entries(reportData.scores).forEach(([skill, scoreValue]) => {
        const score = scoreValue as number;
        const skillName = skillCategories[skill as keyof typeof skillCategories];
        
        // Skill name
        pdf.setFontSize(11);
        pdf.text(skillName, 15, yPos);
        
        // Score text
        pdf.text(`${score}/5`, 180, yPos, { align: 'right' });
        
        // Background bar
        pdf.setFillColor(230, 230, 230);
        pdf.rect(15, yPos + 2, 160, 5, 'F');
        
        // Progress bar with color coding
        const progressWidth = (score / 5) * 160;
        
        if (score >= 4) {
          pdf.setFillColor(colors.success[0], colors.success[1], colors.success[2]);
        } else if (score >= 3) {
          pdf.setFillColor(colors.warning[0], colors.warning[1], colors.warning[2]);
        } else {
          pdf.setFillColor(colors.danger[0], colors.danger[1], colors.danger[2]);
        }
        
        pdf.rect(15, yPos + 2, progressWidth, 5, 'F');
        
        yPos += 15;
      });
      
      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      pdf.text('Report generated by AI Interview Assistant', 105, 285, { align: 'center' });
      
      // Save the PDF locally
      const fileName = `Interview-Report-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Saving local PDF with filename:', fileName);
      pdf.save(fileName);
      console.log('Local PDF saved successfully');
      
    } catch (error) {
      console.error('Error generating local PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
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
              <div className="p-6 bg-gray-50 border-t rounded-b-2xl">
                {/* Upload Status */}
                {uploadError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {uploadError}
                  </div>
                )}
                
                {reportS3Url && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <Link className="w-5 h-5 mr-2" />
                      <span>Report uploaded successfully!</span>
                    </div>
                    <a 
                      href={reportS3Url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      <span>View Report</span>
                    </a>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      setIsComplete(true);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors font-medium"
                  >
                    Continue
                  </button>
                  
                  {/* Show loader while uploading */}
                  {isUploading && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving report to cloud...</span>
                    </div>
                  )}
                  
                  {/* Show download button once uploaded */}
                  {reportS3Url && !isUploading && (
                    <button
                      onClick={() => window.open(reportS3Url, '_blank')}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg hover:from-green-600 hover:to-teal-600 transition-colors flex items-center space-x-2 font-medium"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Report</span>
                    </button>
                  )}
                  
                  {/* Local download button removed as S3 upload is now working correctly */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level3Flow;
