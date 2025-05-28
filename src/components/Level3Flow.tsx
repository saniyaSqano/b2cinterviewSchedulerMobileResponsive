import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Download } from 'lucide-react';
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
    
    // Generate random scores for demonstration purposes
    // In a real implementation, these would be calculated based on actual analysis
    const generateScore = () => Math.floor(Math.random() * 3) + 3; // Random score between 3-5
    
    const scores = {
      structure: generateScore(),
      delivery: generateScore(),
      language: generateScore(),
      bodyLanguage: generateScore(),
      timeManagement: generateScore()
    };
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const averageScore = (totalScore / Object.values(scores).length).toFixed(1);
    
    // Determine recommendation based on average score
    let recommendation = "";
    if (parseFloat(averageScore) >= 4.5) {
      recommendation = "Hire - Excellent candidate with strong communication skills";
    } else if (parseFloat(averageScore) >= 3.5) {
      recommendation = "On-hold - Good potential but needs improvement in some areas";
    } else {
      recommendation = "Reject - Significant improvement needed in multiple areas";
    }
    
    // Determine strengths and opportunities
    const scoreEntries = Object.entries(scores) as [keyof typeof scores, number][];
    const sortedScores = [...scoreEntries].sort((a, b) => b[1] - a[1]);
    
    const strengths = sortedScores.slice(0, 2).map(([area]) => {
      switch(area) {
        case 'structure': return 'Clear and logical structure';
        case 'delivery': return 'Excellent delivery and engagement';
        case 'language': return 'Strong language skills and tone';
        case 'bodyLanguage': return 'Effective body language and presence';
        case 'timeManagement': return 'Excellent time management';
        default: return '';
      }
    });
    
    const opportunities = sortedScores.slice(-2).map(([area]) => {
      switch(area) {
        case 'structure': return 'Improve structure and content flow';
        case 'delivery': return 'Work on delivery pace and vocal variety';
        case 'language': return 'Enhance language clarity and confidence';
        case 'bodyLanguage': return 'Refine body language and camera presence';
        case 'timeManagement': return 'Better time management';
        default: return '';
      }
    });
    
    let reportContent = `# Interview Report for ${userName}\n\n`;
    reportContent += `Date: ${new Date().toLocaleDateString()}\n`;
    reportContent += `Time: ${new Date().toLocaleTimeString()}\n\n`;
    
    // Add overall score and recommendation
    reportContent += `## Overall Assessment\n\n`;
    reportContent += `**Overall Score:** ${averageScore}/5\n\n`;
    reportContent += `**Recommendation:** ${recommendation}\n\n`;
    
    // Add evaluation metrics
    reportContent += `## Evaluation Metrics\n\n`;
    reportContent += `| Category | Score (1-5) |\n`;
    reportContent += `|---------|------------|\n`;
    reportContent += `| Structure & Content | ${scores.structure}/5 |\n`;
    reportContent += `| Delivery & Engagement | ${scores.delivery}/5 |\n`;
    reportContent += `| Language & Tone | ${scores.language}/5 |\n`;
    reportContent += `| Body Language & Presence | ${scores.bodyLanguage}/5 |\n`;
    reportContent += `| Time Management | ${scores.timeManagement}/5 |\n\n`;
    
    // Add strengths and opportunities
    reportContent += `## Strengths & Opportunities\n\n`;
    reportContent += `**Strengths:**\n`;
    strengths.forEach(strength => {
      reportContent += `- ${strength}\n`;
    });
    reportContent += `\n**Opportunities for Improvement:**\n`;
    opportunities.forEach(opportunity => {
      reportContent += `- ${opportunity}\n`;
    });
    reportContent += `\n`;
    
    // Add detailed evaluation criteria
    reportContent += `## Evaluation Criteria\n\n`;
    reportContent += `### Structure & Content\n`;
    reportContent += `- Clear opening (name, role) → logical flow (past → present → future) → concise closing.\n`;
    reportContent += `- Highlights 2-3 role-relevant strengths or achievements.\n\n`;
    
    reportContent += `### Delivery & Engagement\n`;
    reportContent += `- Steady, well-paced voice with minimal fillers.\n`;
    reportContent += `- Strong "eye-contact" (camera focus) and vocal variety.\n\n`;
    
    reportContent += `### Language & Tone\n`;
    reportContent += `- Clear pronunciation and correct grammar.\n`;
    reportContent += `- Positive, confident phrasing—avoids clichés and negativity.\n\n`;
    
    reportContent += `### Body Language & Presence\n`;
    reportContent += `- Upright posture, natural gestures, minimal fidgeting.\n`;
    reportContent += `- Appropriate facial expressions (smile, warmth).\n\n`;
    
    reportContent += `### Time Management\n`;
    reportContent += `- Sticks to allotted time (60–90 sec) without rushing or dragging.\n\n`;
    
    // Add questions and responses
    reportContent += `## Interview Questions and Responses\n\n`;
    questions.forEach((question, index) => {
      reportContent += `### Question ${index + 1}:\n${question}\n\n`;
      
      // Find user response to this question if available
      const response = userResponses[index];
      if (response) {
        reportContent += `**Response:** ${response.text}\n\n`;
      } else {
        reportContent += `**Response:** No response recorded\n\n`;
      }
    });
    
    reportContent += `Report generated by AI Interview Assistant.`;
    
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
        
        {/* Report Modal */}
        {showReportModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-3xl max-h-[90vh] overflow-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Interview Performance Report</h3>
              
              {/* Analytics Dashboard */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
                {['Structure', 'Delivery', 'Language', 'Body Lang', 'Time Mgmt'].map((category, index) => {
                  // Get score from the report content - this is a simple way to extract it
                  const scoreMatch = interviewReport.match(new RegExp(`${category.split(' ')[0]}[^\n]*\| (\d)/5`));
                  const score = scoreMatch ? parseInt(scoreMatch[1]) : 3;
                  
                  return (
                    <div key={index} className="bg-white p-3 rounded-lg shadow text-center">
                      <div className="text-sm font-medium text-gray-500">{category}</div>
                      <div className={`text-2xl font-bold mt-1 ${score >= 4 ? 'text-green-500' : score >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {score}/5
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${(score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Overall Score */}
              <div className="mb-6 bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Overall Performance</h4>
                    <p className="text-sm text-gray-600">
                      {interviewReport.includes('Hire') ? 'Excellent performance!' : 
                       interviewReport.includes('On-hold') ? 'Good with room for improvement' : 
                       'Needs significant improvement'}
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    {interviewReport.match(/Overall Score:\s*([\d.]+)\/5/)?.[1] || '3.5'}/5
                  </div>
                </div>
              </div>
              
              {/* Report Content */}
              <div className="text-left whitespace-pre-line bg-gray-50 p-4 rounded-lg mb-6 max-h-[40vh] overflow-auto border border-gray-200">
                {interviewReport}
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    // Now show the completion overlay
                    setIsComplete(true);
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Continue
                </button>
                <button
                  onClick={downloadReport}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg hover:from-green-600 hover:to-teal-600 transition-colors flex items-center space-x-2"
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
