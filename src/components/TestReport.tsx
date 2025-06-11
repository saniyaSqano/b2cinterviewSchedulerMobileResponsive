import React from 'react';
import { ArrowLeft, User, Mail, Phone, Trophy, Star, TrendingUp, Clock, CheckCircle, XCircle, Award, BookOpen, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import jsPDF from 'jspdf';
import { HARDCODED_CANDIDATE } from '../data/candidateData';

interface TestReportProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeUsed: number;
  totalTime: number;
  onBack: () => void;
  userDetails?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    skills: string;
    experience: string;
  } | null;
}

const TestReport: React.FC<TestReportProps> = ({
  score,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  timeUsed,
  totalTime,
  onBack,
  userDetails
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 70;
  const timeEfficiency = Math.round((timeUsed / totalTime) * 100);

  // Use hardcoded candidate details instead of localStorage
  const candidateDetails = HARDCODED_CANDIDATE;

  const generatePdfReport = () => {
    const pdf = new jsPDF();
    
    // Header with gradient effect simulation
    pdf.setFillColor(99, 102, 241); // Indigo
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('Skill Assessment Report', 105, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    
    // Candidate Details Section
    let yPos = 55;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(18);
    pdf.text('Candidate Information', 20, yPos);
    
    yPos += 10;
    pdf.setFontSize(12);
    pdf.text(`Name: ${candidateDetails.fullName}`, 20, yPos);
    yPos += 7;
    pdf.text(`Email: ${candidateDetails.email}`, 20, yPos);
    yPos += 7;
    pdf.text(`Phone: ${candidateDetails.phoneNumber}`, 20, yPos);
    yPos += 7;
    pdf.text(`Skills: ${candidateDetails.skills}`, 20, yPos);
    yPos += 7;
    pdf.text(`Experience: ${candidateDetails.experience}`, 20, yPos);
    
    // Assessment Results
    yPos += 20;
    pdf.setFontSize(18);
    pdf.text('Assessment Results', 20, yPos);
    
    yPos += 15;
    pdf.setFontSize(14);
    pdf.text(`Overall Score: ${percentage}% (${passed ? 'PASSED' : 'FAILED'})`, 20, yPos);
    yPos += 10;
    pdf.text(`Correct Answers: ${correctAnswers}/${totalQuestions}`, 20, yPos);
    yPos += 10;
    pdf.text(`Wrong Answers: ${wrongAnswers}/${totalQuestions}`, 20, yPos);
    yPos += 10;
    pdf.text(`Time Efficiency: ${timeEfficiency}%`, 20, yPos);
    
    const fileName = `Assessment-Report-${candidateDetails.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  const getScoreColor = () => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = () => {
    if (percentage >= 90) return 'bg-green-100 border-green-500';
    if (percentage >= 70) return 'bg-blue-100 border-blue-500';
    if (percentage >= 50) return 'bg-yellow-100 border-yellow-500';
    return 'bg-red-100 border-red-500';
  };

  const getPerformanceLevel = () => {
    if (percentage >= 90) return { level: 'Excellent', icon: Trophy, color: 'text-green-600' };
    if (percentage >= 70) return { level: 'Good', icon: Star, color: 'text-blue-600' };
    if (percentage >= 50) return { level: 'Average', icon: Target, color: 'text-yellow-600' };
    return { level: 'Needs Improvement', icon: BookOpen, color: 'text-red-600' };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in">
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Skill Assessment Report
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive Performance Analysis</p>
            </div>
            <div className="w-12"></div>
          </div>

          {/* Main Result Card */}
          <Card className={`${getScoreBgColor()} border-2 shadow-2xl animate-fade-in`} style={{ animationDelay: '200ms' }}>
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <div className={`w-32 h-32 rounded-full ${getScoreBgColor()} border-4 flex items-center justify-center shadow-2xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <div className={`text-4xl font-bold ${getScoreColor()}`}>{percentage}%</div>
                    <div className="text-sm text-gray-600 font-medium">Score</div>
                  </div>
                </div>
              </div>
              
              <CardTitle className={`text-3xl mb-4 flex items-center justify-center gap-3`}>
                <PerformanceIcon className={`w-8 h-8 ${performance.color}`} />
                <span className={performance.color}>
                  {passed ? '🎉 Assessment Passed!' : '📚 Keep Learning!'}
                </span>
              </CardTitle>
              
              <p className="text-lg text-gray-700 mb-6">
                {passed 
                  ? 'Congratulations! You have successfully completed the skill assessment.'
                  : 'You need 70% or higher to pass. Keep practicing and try again!'}
              </p>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <div className={`text-2xl font-bold ${getScoreColor()}`}>{correctAnswers}</div>
                  <div className="text-gray-600 text-sm">Correct</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <div className="text-2xl font-bold text-red-500">{wrongAnswers}</div>
                  <div className="text-gray-600 text-sm">Wrong</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <div className="text-2xl font-bold text-blue-500">{Math.round(timeUsed / 60)}m</div>
                  <div className="text-gray-600 text-sm">Time Used</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <div className="text-2xl font-bold text-purple-500">{timeEfficiency}%</div>
                  <div className="text-gray-600 text-sm">Efficiency</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Candidate Details */}
            <Card className="bg-white/90 backdrop-blur-md shadow-xl animate-fade-in border border-white/50" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-indigo-800">
                  <User className="w-6 h-6" />
                  Candidate Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Full Name</p>
                        <p className="text-gray-900 font-semibold text-lg">{candidateDetails.fullName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Email Address</p>
                        <p className="text-gray-900 font-semibold">{candidateDetails.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                        <p className="text-gray-900 font-semibold">{candidateDetails.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200/50">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Skills</p>
                        <p className="text-gray-900 font-semibold">{candidateDetails.skills}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-cyan-600" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Experience</p>
                        <p className="text-gray-900 font-semibold">{candidateDetails.experience}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Card className="bg-white/90 backdrop-blur-md shadow-xl animate-fade-in border border-white/50" style={{ animationDelay: '600ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-indigo-800">
                  <Award className="w-6 h-6" />
                  Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="font-medium text-gray-800">Correct Answers</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                      <div className="text-sm text-gray-500">out of {totalQuestions}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200/50">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-red-600" />
                      <span className="font-medium text-gray-800">Wrong Answers</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
                      <div className="text-sm text-gray-500">out of {totalQuestions}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <span className="font-medium text-gray-800">Time Efficiency</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{timeEfficiency}%</div>
                      <div className="text-sm text-gray-500">{Math.round(timeUsed / 60)}m used</div>
                    </div>
                  </div>
                </div>

                {/* Performance Level */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200/50">
                  <div className="flex items-center gap-4 mb-4">
                    <PerformanceIcon className={`w-8 h-8 ${performance.color}`} />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Performance Level</h3>
                      <p className={`text-xl font-semibold ${performance.color}`}>{performance.level}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className={`h-4 rounded-full bg-gradient-to-r ${
                        percentage >= 90 ? 'from-green-500 to-emerald-500' :
                        percentage >= 70 ? 'from-blue-500 to-indigo-500' :
                        percentage >= 50 ? 'from-yellow-500 to-amber-500' :
                        'from-red-500 to-pink-500'
                      } transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">{percentage}% Overall Score</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
            <Button
              onClick={onBack}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-full text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Back to Dashboard
            </Button>
            
            <Button
              onClick={generatePdfReport}
              variant="outline"
              className="px-8 py-4 rounded-full text-lg font-medium border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              📥 Download Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReport;
