import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, User, Clock, Eye, Mic, AlertTriangle, CheckCircle, Star, TrendingUp, FileText, Award, Shield, Info } from 'lucide-react';
import jsPDF from 'jspdf';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { generateFaceDetectionSummary, FaceDetectionSummaryTable, generateTextSummaryFromTable } from '../utils/rule_based_logic';

interface ViolationLog {
  id: number;
  type: 'warning' | 'error';
  message: string;
  timestamp: Date;
  details?: string;
}

interface CandidateDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  skills: string;
  experience: string;
}

interface ProctoredInterviewReportProps {
  candidateDetails: CandidateDetails;
  violationLogs: ViolationLog[];
  onBack: () => void;
  duration: number; // in minutes
  interviewStartTime: Date;
  totalQuestions: number;
  answeredQuestions: number;
}

const ProctoredInterviewReport: React.FC<ProctoredInterviewReportProps> = ({
  candidateDetails,
  violationLogs,
  onBack,
  duration,
  interviewStartTime,
  totalQuestions,
  answeredQuestions
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // State for face detection summary
  const [faceDetectionSummary, setFaceDetectionSummary] = useState<FaceDetectionSummaryTable | null>(null);

  // Generate face detection summary when component mounts
  useEffect(() => {
    // Convert violation logs to the format expected by rule_based_logic
    const violations = violationLogs.map(log => ({
      type: log.type,
      message: log.message,
      details: log.details,
      timestamp: log.timestamp
    }));

    // Generate summary using the rule-based logic
    const summaryTable = generateFaceDetectionSummary(violations, candidateDetails.fullName);
    setFaceDetectionSummary(summaryTable);
  }, [violationLogs, candidateDetails.fullName]);

  // Process violation data for pie chart
  const getViolationChartData = () => {
    const violationCounts: { [key: string]: number } = {};
    
    violationLogs.forEach(log => {
      // Simplify violation messages for better chart readability
      let violationType = log.message;
      
      if (log.message.includes('Multiple faces detected') || log.message.includes('Multiple people detected')) {
        violationType = 'Multiple faces detected';
      } else if (log.message.includes('No face detected')) {
        violationType = 'No face detected';
      } else if (log.message.includes('Eye tracking') || log.message.includes('looking away')) {
        violationType = 'Looking away from camera';
      } else if (log.message.includes('Unauthorized person')) {
        violationType = 'Unauthorized person detected';
      } else if (log.message.includes('Audio levels') || log.message.includes('interference')) {
        violationType = 'Audio interference';
      } else if (log.message.includes('Screen sharing') || log.message.includes('recording software')) {
        violationType = 'Recording software detected';
      } else if (log.message.includes('Lighting conditions')) {
        violationType = 'Poor lighting conditions';
      } else if (log.message.includes('Tab change') || log.message.includes('Keyboard shortcuts')) {
        violationType = 'Tab/keyboard violations';
      }
      
      violationCounts[violationType] = (violationCounts[violationType] || 0) + 1;
    });

    return Object.entries(violationCounts).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / violationLogs.length) * 100).toFixed(1)
    }));
  };

  const violationChartData = getViolationChartData();

  // Updated colors for different violation types - more vibrant and distinct
  const VIOLATION_COLORS = [
    '#FF6B6B', // Coral red
    '#4ECDC4', // Teal
    '#45B7D1', // Sky blue
    '#96CEB4', // Mint green
    '#FFEAA7', // Light yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F'  // Light gold
  ];

  const chartConfig = {
    violations: {
      label: "Violations"
    }
  };

  // Calculate AI-based hire recommendation
  const calculateHireRecommendation = () => {
    let score = 100;
    let factors = [];

    // Deduct points for violations
    const errorViolations = violationLogs.filter(log => log.type === 'error').length;
    const warningViolations = violationLogs.filter(log => log.type === 'warning').length;
    
    score -= errorViolations * 15; // Major violations
    score -= warningViolations * 5; // Minor violations

    if (errorViolations > 0) {
      factors.push(`${errorViolations} security breach(es) detected`);
    }
    if (warningViolations > 0) {
      factors.push(`${warningViolations} minor violation(s) detected`);
    }
    
    // Check for multiple faces violations specifically
    const multipleFacesViolations = violationLogs.filter(log => 
      log.type === 'error' && log.message.includes('Multiple faces detected')
    ).length;
    
    if (multipleFacesViolations > 0) {
      factors.push(`${candidateDetails.fullName} was present with more than one people`);
    }

    // Consider completion rate
    const completionRate = (answeredQuestions / totalQuestions) * 100;
    if (completionRate < 80) {
      score -= (80 - completionRate) * 0.5;
      factors.push(`Interview completion: ${completionRate.toFixed(1)}%`);
    }

    // Consider duration (too fast might be suspicious)
    const expectedDuration = totalQuestions * 7.5; // 7.5 minutes per question
    if (duration < expectedDuration * 0.6) {
      score -= 10;
      factors.push('Interview completed unusually fast');
    }

    score = Math.max(0, Math.min(100, score));

    let recommendation = 'Not Recommended';
    let recommendationColor = 'text-red-600';
    let recommendationBg = 'bg-red-50';

    if (score >= 85) {
      recommendation = 'Highly Recommended';
      recommendationColor = 'text-green-600';
      recommendationBg = 'bg-green-50';
    } else if (score >= 70) {
      recommendation = 'Recommended';
      recommendationColor = 'text-blue-600';
      recommendationBg = 'bg-blue-50';
    } else if (score >= 50) {
      recommendation = 'Conditional';
      recommendationColor = 'text-yellow-600';
      recommendationBg = 'bg-yellow-50';
    }

    return { score: Math.round(score), recommendation, recommendationColor, recommendationBg, factors };
  };

  const { score, recommendation, recommendationColor, recommendationBg, factors } = calculateHireRecommendation();

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('AI Proctored Interview Report', 20, 30);
    
    // Candidate Details
    doc.setFontSize(16);
    doc.text('Candidate Information', 20, 50);
    doc.setFontSize(12);
    doc.text(`Name: ${candidateDetails.fullName}`, 20, 65);
    doc.text(`Email: ${candidateDetails.email}`, 20, 75);
    doc.text(`Phone: ${candidateDetails.phoneNumber}`, 20, 85);
    
    // Interview Details
    doc.setFontSize(16);
    doc.text('Interview Details', 20, 110);
    doc.setFontSize(12);
    doc.text(`Date: ${interviewStartTime.toLocaleDateString()}`, 20, 125);
    doc.text(`Duration: ${duration} minutes`, 20, 135);
    doc.text(`Questions: ${answeredQuestions}/${totalQuestions}`, 20, 145);
    
    // AI Recommendation
    doc.setFontSize(16);
    doc.text('AI Recommendation', 20, 170);
    doc.setFontSize(12);
    doc.text(`Score: ${score}/100`, 20, 185);
    doc.text(`Recommendation: ${recommendation}`, 20, 195);
    
    // Face Detection Analysis
    doc.setFontSize(16);
    doc.text('Face Detection Analysis', 20, 220);
    doc.setFontSize(12);
    
    if (faceDetectionSummary) {
      // Add summary text
      const textSummary = generateTextSummaryFromTable(faceDetectionSummary);
      doc.text(textSummary, 20, 235);
      
      // Add table headers
      let y = 260;
      doc.setFillColor(240, 240, 250);
      doc.rect(20, y, 170, 10, 'F');
      doc.setTextColor(50, 50, 100);
      doc.setFontSize(10);
      doc.text('Issue', 22, y + 7);
      doc.text('Occurrences', 70, y + 7);
      doc.text('Impact', 100, y + 7);
      doc.text('Recommendation', 130, y + 7);
      
      // Add table rows
      y += 12;
      doc.setTextColor(0, 0, 0);
      faceDetectionSummary.rows.forEach((row, index) => {
        doc.text(row.issue, 22, y);
        doc.text(row.occurrences.toString(), 70, y);
        doc.text(row.impact, 100, y);
        doc.text(row.recommendation, 130, y);
        y += 10;
      });
    } else {
      doc.text('No face detection data available', 20, 235);
    }
    
    // Violations
    doc.setFontSize(16);
    doc.text('Security Violations', 20, 300);
    doc.setFontSize(12);
    if (violationLogs.length === 0) {
      doc.text('No violations detected', 20, 315);
    } else {
      let y = 315;
      violationLogs.slice(0, 10).forEach((log, index) => {
        doc.text(`${index + 1}. ${log.message}`, 20, y);
        y += 10;
      });
    }
    
    doc.save(`interview-report-${candidateDetails.fullName.replace(/\s+/g, '-')}.pdf`);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Proctored Interview Report</h1>
              <p className="text-sm text-gray-600">Comprehensive analysis and recommendation</p>
            </div>
          </div>
          
          <button
            onClick={generatePDFReport}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors font-medium shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* AI Recommendation Card */}
        <div className={`${recommendationBg} rounded-2xl p-6 mb-6 border-2 border-white/50 shadow-xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">AI Hire Recommendation</h2>
                <p className="text-sm text-gray-600">Based on comprehensive analysis</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">{score}/100</div>
              <div className={`text-lg font-bold ${recommendationColor}`}>{recommendation}</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner mb-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                score >= 85 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                  : score >= 70
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                    : score >= 50
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          {factors.length > 0 && (
            <div className="bg-white/70 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Key Factors:</h4>
              <ul className="space-y-1">
                {factors.map((factor, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'candidate', label: 'Candidate Details', icon: User },
                { id: 'security', label: 'Security Analysis', icon: Shield },
                { id: 'performance', label: 'Performance Metrics', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Duration</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{formatDuration(duration)}</p>
                  <p className="text-sm text-gray-600">Total interview time</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Completion</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{((answeredQuestions / totalQuestions) * 100).toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">{answeredQuestions}/{totalQuestions} questions</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Eye className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">Face Detection</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">Active</p>
                  <p className="text-sm text-gray-600">Continuous monitoring</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Violations</h3>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{violationLogs.length}</p>
                  <p className="text-sm text-gray-600">Total detected</p>
                </div>
              </div>
            )}

            {activeTab === 'candidate' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Personal Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Full Name:</span>
                        <p className="font-medium">{candidateDetails.fullName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{candidateDetails.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <p className="font-medium">{candidateDetails.phoneNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Professional Background</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Skills:</span>
                        <p className="font-medium">{candidateDetails.skills || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Experience:</span>
                        <p className="font-medium">{candidateDetails.experience || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Interview Session Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Start Time:</span>
                      <p className="font-medium">{interviewStartTime.toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Date:</span>
                      <p className="font-medium">{interviewStartTime.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Duration:</span>
                      <p className="font-medium">{formatDuration(duration)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Questions:</span>
                      <p className="font-medium">{answeredQuestions}/{totalQuestions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Security Monitoring Status</h3>
                  
                  {/* Face Detection Summary Table */}
                  {faceDetectionSummary && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800 flex items-center">
                          <Eye className="w-5 h-5 mr-2 text-blue-600" />
                          Face Detection Analysis
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${faceDetectionSummary.overallStatus === 'Excellent' ? 'bg-green-100 text-green-700' : faceDetectionSummary.overallStatus === 'Fair' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {faceDetectionSummary.overallStatus}
                        </span>
                      </div>
                      
                      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Issue
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Occurrences
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Impact
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Recommendation
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {faceDetectionSummary.rows.map((row, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  <div className="flex items-center">
                                    {row.issue === 'No issues detected' ? (
                                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                    ) : row.issue === 'Multiple people detected' ? (
                                      <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                                    ) : (
                                      <Info className="w-4 h-4 mr-2 text-yellow-500" />
                                    )}
                                    {row.issue}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {row.occurrences}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.impact.includes('High') ? 'bg-red-100 text-red-700' : row.impact.includes('Medium') ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {row.impact}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {row.recommendation}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">Face Detection: Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">Audio Monitoring: Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">Tab Switching: Monitored</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">Screen Recording: Detected</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Violation Analysis</h3>
                  {violationLogs.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-green-600">
                      <CheckCircle className="w-8 h-8 mr-3" />
                      <span className="text-lg font-medium">No violations detected - Excellent conduct!</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Pie Chart */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Violation Distribution</h4>
                        <ChartContainer config={chartConfig} className="h-64">
                          <PieChart>
                            <Pie
                              data={violationChartData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              nameKey="name"
                            >
                              {violationChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={VIOLATION_COLORS[index % VIOLATION_COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                          </PieChart>
                        </ChartContainer>
                      </div>
                      
                      {/* Statistics */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Violation Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-sm font-medium">Total Violations</span>
                            <span className="text-lg font-bold text-red-600">{violationLogs.length}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-sm font-medium">Error Level</span>
                            <span className="text-lg font-bold text-red-600">
                              {violationLogs.filter(log => log.type === 'error').length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-sm font-medium">Warning Level</span>
                            <span className="text-lg font-bold text-yellow-600">
                              {violationLogs.filter(log => log.type === 'warning').length}
                            </span>
                          </div>
                          
                          {/* Top violations */}
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-700 mb-2">Most Frequent Violations</h5>
                            <div className="space-y-2">
                              {violationChartData.slice(0, 3).map((violation, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                                  <div className="flex items-center space-x-2">
                                    <div 
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: VIOLATION_COLORS[index] }}
                                    />
                                    <span className="text-xs font-medium">{violation.name}</span>
                                  </div>
                                  <span className="text-xs text-gray-600">{violation.value} times ({violation.percentage}%)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      <h3 className="font-semibold text-gray-800">Overall Score</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{score}/100</div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="font-semibold text-gray-800">Completion Rate</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {((answeredQuestions / totalQuestions) * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">{answeredQuestions} of {totalQuestions} questions</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Star className="w-6 h-6 text-purple-600" />
                      <h3 className="font-semibold text-gray-800">Integrity Score</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {violationLogs.length === 0 ? '100' : Math.max(0, 100 - violationLogs.length * 10)}%
                      </div>
                      <p className="text-sm text-gray-600">Based on violations</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Performance Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Interview Completion</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{((answeredQuestions / totalQuestions) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Security Compliance</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.max(0, 100 - violationLogs.length * 10)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.max(0, 100 - violationLogs.length * 10)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Time Management</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (duration / (totalQuestions * 7.5)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.min(100, Math.round((duration / (totalQuestions * 7.5)) * 100))}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProctoredInterviewReport;
