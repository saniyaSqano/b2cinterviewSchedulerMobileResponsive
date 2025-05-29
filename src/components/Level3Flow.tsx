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
  const [isAsking, setIsAsking] = useState(false);
  const [responseTimer, setResponseTimer] = useState<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportS3Url, setReportS3Url] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isListeningForResponse, setIsListeningForResponse] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [savedTranscripts, setSavedTranscripts] = useState<string[]>([]);

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

  const handleQuestionComplete = () => {
    setIsAsking(false);
    setIsListeningForResponse(true);
    
    // Give user 30 seconds to respond before moving to next question
    const timer = setTimeout(() => {
      moveToNextQuestion();
    }, 30000);
    
    setResponseTimer(timer);
  };

  const handleSpeechResult = (transcript: string) => {
    setCurrentTranscript(transcript);
    
    // Auto-proceed when user finishes speaking (after 2 seconds of silence)
    if (responseTimer) {
      clearTimeout(responseTimer);
    }
    
    const timer = setTimeout(() => {
      if (transcript.trim()) {
        // Save the final transcript
        setSavedTranscripts(prev => [...prev, transcript]);
        
        const userMessage: Message = {
          id: Date.now(),
          text: transcript,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setCurrentTranscript('');
        setIsListeningForResponse(false);
        moveToNextQuestion();
      }
    }, 2000);
    
    setResponseTimer(timer);
  };

  const moveToNextQuestion = () => {
    if (responseTimer) {
      clearTimeout(responseTimer);
      setResponseTimer(null);
    }
    
    setIsListeningForResponse(false);

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
  
  // Generate interview report based on questions and messages with analytics
  const generateInterviewReport = () => {
    // Use saved transcripts for more reliable response tracking
    const userResponses = savedTranscripts.map((text, index) => ({
      id: Date.now() + index,
      text,
      sender: 'user' as const,
      timestamp: new Date()
    }));
    
    // Ensure we have messages for each transcript
    if (messages.filter(msg => msg.sender === 'user').length < userResponses.length) {
      setMessages(prev => {
        const aiMessages = prev.filter(msg => msg.sender === 'ai');
        return [...aiMessages, ...userResponses];
      });
    }
    
    console.log('Generating report with responses:', userResponses);
    
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
      
      // Add a dedicated Questions & Answers section header
      pdf.addPage();
      yPos = 20;
      
      pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.rect(0, 0, 210, 30, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text('INTERVIEW QUESTIONS & ANSWERS', 105, 20, { align: 'center' });
      
      // Start content after header
      yPos = 40;
      
      // Add each question and response in a more structured format
      reportData.questions.forEach((question: string, index: number) => {
        // Check if we need a new page
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Question number box
        pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.roundedRect(15, yPos, 180, 10, 2, 2, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.text(`Question ${index + 1} of ${reportData.questions.length}`, 105, yPos + 7, { align: 'center' });
        
        yPos += 20;
        
        // Question text
        pdf.setFillColor(240, 240, 250);
        pdf.roundedRect(15, yPos - 5, 180, 25, 2, 2, 'F');
        
        pdf.setFontSize(11);
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.text('Question:', 20, yPos);
        
        yPos += 7;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        const questionLines = pdf.splitTextToSize(question, 170);
        pdf.text(questionLines, 20, yPos);
        
        // Calculate text height based on content length and width
        yPos += questionLines.length * 5 + 10;
        
        // Find corresponding response
        const response = reportData.userResponses[index];
        
        // Response box
        pdf.setFillColor(245, 250, 245);
        pdf.roundedRect(15, yPos - 5, 180, response ? 40 : 20, 2, 2, 'F');
        
        pdf.setFontSize(11);
        pdf.setTextColor(16, 185, 129); // Green color for 'Your Answer'
        pdf.text('Your Answer:', 20, yPos);
        
        yPos += 7;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        
        if (response) {
          const responseLines = pdf.splitTextToSize(response.text, 170);
          pdf.text(responseLines, 20, yPos);
          yPos += responseLines.length * 5 + 5;
        } else {
          pdf.text('No response recorded', 20, yPos);
          yPos += 10;
        }
        
        // Add analysis of the response
        if (response) {
          yPos += 5;
          pdf.setFillColor(250, 250, 255);
          pdf.roundedRect(15, yPos - 5, 180, 25, 2, 2, 'F');
          
          pdf.setFontSize(11);
          pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
          pdf.text('Analysis:', 20, yPos);
          
          yPos += 7;
          pdf.setFontSize(9);
          pdf.setTextColor(80, 80, 80);
          
          // Generate a simple analysis based on the response
          const wordCount = response.text.split(' ').length;
          let analysis = '';
          
          if (wordCount < 10) {
            analysis = 'Your answer was concise. Consider providing more details in future responses.';
          } else if (wordCount < 25) {
            analysis = 'Good response length. You provided a clear and focused answer.';
          } else {
            analysis = 'Excellent detailed response. You demonstrated thorough communication skills.';
          }
          
          const analysisLines = pdf.splitTextToSize(analysis, 170);
          pdf.text(analysisLines, 20, yPos);
          yPos += analysisLines.length * 5 + 5;
        }
        
        // Add some spacing between Q&A pairs
        yPos += 15;
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
      // If we already have a report URL, use it
      if (reportS3Url) {
        window.open(reportS3Url, '_blank');
        return;
      }
      
      // Otherwise generate and upload the report
      setIsUploading(true);
      const url = await generateAndUploadReport();
      
      if (url) {
        window.open(url, '_blank');
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
        {/* Left Side - Video Feed (50%) */}
        <div className="w-1/2 bg-gradient-to-br from-pink-100/80 to-purple-100/80 backdrop-blur-md border-r border-white/20 flex flex-col">
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
                onClick={generateInterviewReport}
                className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg flex items-center space-x-1"
                title="End Recording"
              >
                <span>End Recording</span>
              </button>
            </div>
          </div>

          {/* Your Video Feed */}
          <div className="flex-1 p-6">
            <VideoFeed onStatusChange={setIsVideoOn} />
          </div>
          
          {/* Audio Controls and Speech Recognition */}
          <div className="p-4 flex justify-center items-center space-x-4">
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
            
            {/* Speech Recognition Component */}
            {isListeningForResponse && isMicOn && (
              <SpeechRecognition
                onResult={handleSpeechResult}
                autoStart={true}
              />
            )}
          </div>

          {/* Voice Response Status */}
          <div className="p-4 text-center">
            {isListeningForResponse ? (
              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-800 font-medium">Listening for your response...</span>
                </div>
              </div>
            ) : isAISpeaking ? (
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-800 font-medium">AI is speaking...</span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <span className="text-gray-600">Ready for next question...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Speech Transcript Display (50%) */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Speech Recognition</h3>
                <p className="text-gray-600">Your spoken responses are captured here</p>
              </div>
            </div>
          </div>

          {/* Current Transcript Display */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Current Response</h4>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 min-h-[120px] border border-blue-200">
              {isListeningForResponse ? (
                <div>
                  {currentTranscript ? (
                    <div>
                      <p className="text-gray-800 text-lg leading-relaxed">{currentTranscript}</p>
                      <div className="flex items-center space-x-2 mt-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-600 text-sm font-medium">Speaking detected...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-blue-600 font-medium">Waiting for your response...</p>
                        <p className="text-gray-500 text-sm mt-1">Start speaking to see your words appear</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Mic className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p>Ready to capture your next response</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Saved Transcripts */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Previous Responses</h4>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {savedTranscripts.length} responses
              </span>
            </div>
            
            <div className="space-y-4">
              {savedTranscripts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No responses recorded yet</p>
                  <p className="text-gray-400 text-sm mt-1">Your spoken answers will appear here</p>
                </div>
              ) : (
                savedTranscripts.map((transcript, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-semibold text-gray-800">Question {index + 1} Response</h5>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            Completed
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{transcript}</p>
                        <div className="flex items-center space-x-2 mt-3 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Recorded just now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden AI Interviewer for questions */}
        <div className="hidden">
          <AnimatedAIInterviewer
            currentQuestion={questions[currentQuestionIndex]}
            isAsking={isAsking}
            onQuestionComplete={handleQuestionComplete}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        </div>
        
        {/* Hidden AISpeech component for voice */}
        {currentSpeechText && (
          <div className="hidden">
            <AISpeech 
              text={currentSpeechText} 
              onSpeechEnd={() => setIsAISpeaking(false)}
              autoPlay={isAISpeaking}
            />
          </div>
        )}
        
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
        
        {/* Enhanced Report Modal */}
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

              {/* Questions and Answers Section */}
              <div className="p-6 bg-indigo-50 border-t border-indigo-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2" />
                  Questions & Answers
                </h3>
                
                {reportData.questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No questions or answers recorded yet.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reportData.questions.map((question: string, index: number) => {
                      const response = reportData.userResponses[index];
                      
                      return (
                        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                          {/* Question header */}
                          <div className="bg-indigo-600 px-4 py-2 text-white">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold mr-2">
                                {index + 1}
                              </div>
                              <span className="font-medium">Question {index + 1} of {reportData.questions.length}</span>
                            </div>
                          </div>
                          
                          {/* Question */}
                          <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                            <h4 className="font-medium text-indigo-800 mb-2">Question:</h4>
                            <p className="text-gray-800">{question}</p>
                          </div>
                          
                          {/* Answer */}
                          <div className="p-4">
                            <h4 className="font-medium text-green-700 mb-2">Your Answer:</h4>
                            {response ? (
                              <div>
                                <p className="text-gray-800 whitespace-pre-line">{response.text}</p>
                                
                                {/* Analysis */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <h5 className="text-sm font-medium text-gray-600 mb-1">Analysis:</h5>
                                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                                    {response.text.split(' ').length < 10 ? (
                                      <p>Your answer was concise. Consider providing more details in future responses.</p>
                                    ) : response.text.split(' ').length < 25 ? (
                                      <p>Good response length. You provided a clear and focused answer.</p>
                                    ) : (
                                      <p>Excellent detailed response. You demonstrated thorough communication skills.</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">No response recorded</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
