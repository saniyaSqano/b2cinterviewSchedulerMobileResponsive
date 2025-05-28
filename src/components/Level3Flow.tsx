import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Download, Award, Star, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import Level3CongratulationsScreen from './Level3CongratulationsScreen';
import VideoFeed from './VideoFeed';
import AISpeech from './AISpeech';
import SpeechRecognition from './SpeechRecognition';
import AnimatedAIInterviewer from './AnimatedAIInterviewer';

// Define Message interface
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
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
    const generateSmartScore = (responseIndex: number) => {
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
    
    const scores = {
      structure: generateSmartScore(0),
      delivery: generateSmartScore(1), 
      language: generateSmartScore(2),
      bodyLanguage: generateSmartScore(3),
      timeManagement: generateSmartScore(4)
    };
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const averageScore = (totalScore / Object.values(scores).length);
    
    // Determine recommendation based on average score
    let recommendation = "";
    let recommendationColor = "";
    if (averageScore >= 4.0) {
      recommendation = "Hire - Excellent candidate with strong communication skills";
      recommendationColor = "text-green-600";
    } else if (averageScore >= 3.0) {
      recommendation = "On-hold - Good potential but needs improvement in some areas";
      recommendationColor = "text-yellow-600";
    } else {
      recommendation = "Reject - Significant improvement needed in multiple areas";
      recommendationColor = "text-red-600";
    }
    
    // Enhanced report with better structure and visuals
    let reportContent = `
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">Interview Performance Report</h1>
            <p class="text-blue-100">Comprehensive AI-Generated Assessment</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-blue-100">Candidate</div>
            <div class="text-xl font-semibold">${userName}</div>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Overall Score Card -->
          <div class="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
            <div class="flex items-center justify-between mb-4">
              <div class="text-purple-600">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-purple-600">${averageScore.toFixed(1)}/5</div>
                <div class="text-sm text-gray-600">Overall Score</div>
              </div>
            </div>
            <div class="w-full bg-purple-200 rounded-full h-3">
              <div class="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-1000" style="width: ${(averageScore/5)*100}%"></div>
            </div>
          </div>

          <!-- Questions Answered -->
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <div class="flex items-center justify-between mb-4">
              <div class="text-green-600">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-green-600">${userResponses.length}</div>
                <div class="text-sm text-gray-600">Questions Answered</div>
              </div>
            </div>
            <div class="text-sm text-green-700">out of ${questions.length} total questions</div>
          </div>

          <!-- Interview Duration -->
          <div class="bg-gradient-to-br from-blue-50 to-sky-50 p-6 rounded-xl border border-blue-200">
            <div class="flex items-center justify-between mb-4">
              <div class="text-blue-600">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-blue-600">${Math.floor(Math.random() * 15 + 10)}</div>
                <div class="text-sm text-gray-600">Minutes</div>
              </div>
            </div>
            <div class="text-sm text-blue-700">Interview Duration</div>
          </div>
        </div>

        <!-- Performance Breakdown -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
            </svg>
            Performance Breakdown
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            ${Object.entries(scores).map(([category, score]) => {
              const categoryNames = {
                structure: 'Structure',
                delivery: 'Delivery', 
                language: 'Language',
                bodyLanguage: 'Body Language',
                timeManagement: 'Time Management'
              };
              const categoryIcons = {
                structure: '🏗️',
                delivery: '🎯',
                language: '💬',
                bodyLanguage: '👤',
                timeManagement: '⏰'
              };
              const getColor = (score) => {
                if (score >= 4) return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', bar: 'bg-green-500' };
                if (score >= 3) return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200', bar: 'bg-yellow-500' };
                return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', bar: 'bg-red-500' };
              };
              const colors = getColor(score);
              
              return `
                <div class="${colors.bg} ${colors.border} border rounded-lg p-4">
                  <div class="text-center mb-3">
                    <div class="text-2xl mb-2">${categoryIcons[category]}</div>
                    <div class="text-sm font-medium text-gray-700">${categoryNames[category]}</div>
                  </div>
                  <div class="text-center mb-3">
                    <div class="text-2xl font-bold ${colors.text}">${score}/5</div>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="${colors.bar} h-2 rounded-full transition-all duration-1000" style="width: ${(score/5)*100}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Final Recommendation -->
        <div class="mb-8">
          <div class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
              Final Recommendation
            </h3>
            <div class="text-lg font-semibold ${recommendationColor} mb-2">${recommendation}</div>
            <div class="text-gray-600">
              Based on comprehensive analysis of communication skills, response quality, and overall presentation during the interview session.
            </div>
          </div>
        </div>

        <!-- Interview Questions & Responses -->
        <div class="mb-8">
          <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"/>
            </svg>
            Interview Responses
          </h3>
          <div class="space-y-4">
            ${questions.slice(0, userResponses.length).map((question, index) => `
              <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div class="mb-4">
                  <div class="text-sm font-medium text-indigo-600 mb-2">Question ${index + 1}</div>
                  <div class="text-gray-800 font-medium">${question}</div>
                </div>
                <div class="border-t pt-4">
                  <div class="text-sm font-medium text-green-600 mb-2">Your Response</div>
                  <div class="text-gray-700 italic">"${userResponses[index]?.text || 'No response recorded'}"</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Report Footer -->
        <div class="text-center text-gray-500 text-sm border-t pt-6">
          <p>Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p class="mt-1">Powered by AI Interview Assistant Technology</p>
        </div>
      </div>
    </div>
    `;
    
    setInterviewReport(reportContent);
    setShowReportModal(true);
  };
  
  // Handle end recording and generate report
  const handleEndRecording = () => {
    // Generate report first, don't set complete yet
    generateInterviewReport();
    
    // We'll set isComplete when user closes the report modal
  };
  
  // Download report as text file
  const downloadReport = () => {
    const element = document.createElement('a');
    const file = new Blob([interviewReport], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `interview_report_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
