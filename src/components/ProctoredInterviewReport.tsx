import React from 'react';
import { ArrowLeft, Download, Clock, User, Mail, Phone, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import jsPDF from 'jspdf';

interface CandidateDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  skills: string;
  experience: string;
}

interface ViolationLog {
  id: number;
  type: 'warning' | 'error';
  message: string;
  timestamp: Date;
  details?: string;
}

interface ProctoredInterviewReportProps {
  candidateDetails: CandidateDetails;
  violationLogs: ViolationLog[];
  onBack: () => void;
  duration: number;
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
  // Process violation data for pie chart and table
  const processViolationData = () => {
    const violationCounts: { [key: string]: { count: number, type: 'warning' | 'error', timestamps: Date[] } } = {};
    
    violationLogs.forEach(log => {
      const key = log.message;
      if (!violationCounts[key]) {
        violationCounts[key] = { count: 0, type: log.type, timestamps: [] };
      }
      violationCounts[key].count += 1;
      violationCounts[key].timestamps.push(log.timestamp);
    });

    return Object.entries(violationCounts).map(([name, data]) => ({
      name: name.length > 30 ? name.substring(0, 30) + '...' : name,
      value: data.count,
      fullName: name,
      type: data.type,
      timestamps: data.timestamps,
      impact: data.type === 'error' ? 'High' : 'Medium',
      recommendation: name.toLowerCase().includes('multiple') 
        ? 'Ensure you are alone during the interview' 
        : name.toLowerCase().includes('tab') || name.toLowerCase().includes('keyboard')
        ? 'Avoid using shortcuts and stay focused on the interview'
        : 'Stay visible in the camera frame'
    }));
  };

  const violationData = processViolationData();

  // Custom colors for the pie chart - more vibrant colors
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  // Calculate scores and recommendations
  const calculateScore = () => {
    const errorCount = violationLogs.filter(log => log.type === 'error').length;
    const warningCount = violationLogs.filter(log => log.type === 'warning').length;
    
    // Base score
    let score = 100;
    
    // Deduct points for violations
    score -= errorCount * 15; // 15 points per error
    score -= warningCount * 5; // 5 points per warning
    
    // Bonus for completing questions
    const completionBonus = (answeredQuestions / totalQuestions) * 10;
    score += completionBonus;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const getRecommendation = (score: number) => {
    if (score >= 85) return 'Highly Recommended';
    if (score >= 70) return 'Recommended';
    if (score >= 50) return 'Conditionally Recommended';
    return 'Not Recommended';
  };

  const score = calculateScore();
  const recommendation = getRecommendation(score);

  const generatePDF = () => {
    try {
      console.log('Starting enhanced PDF generation...');
      const doc = new jsPDF();
      
      // Set colors for PDF
      const primaryColor = [102, 51, 153]; // Purple
      const secondaryColor = [79, 70, 229]; // Indigo
      const errorColor = [239, 68, 68]; // Red
      const warningColor = [245, 158, 11]; // Yellow
      const successColor = [34, 197, 94]; // Green
      
      // Header with color
      doc.setTextColor(...primaryColor);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Proctored Interview Report', 20, 25);
      
      // Reset to black for body text
      doc.setTextColor(0, 0, 0);
      
      // Candidate Information Section
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Candidate Information', 20, 45);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${candidateDetails.fullName}`, 20, 55);
      doc.text(`Email: ${candidateDetails.email}`, 20, 65);
      doc.text(`Phone: ${candidateDetails.phoneNumber}`, 20, 75);
      doc.text(`Skills: ${candidateDetails.skills}`, 20, 85);
      doc.text(`Experience: ${candidateDetails.experience}`, 20, 95);
      
      // Interview Details Section
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Interview Details', 20, 115);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${interviewStartTime.toLocaleDateString()}`, 20, 125);
      doc.text(`Duration: ${duration} minutes`, 20, 135);
      doc.text(`Questions Answered: ${answeredQuestions}/${totalQuestions}`, 20, 145);
      
      // AI Recommendation Section with colored background
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Recommendation', 20, 165);
      
      // Score with color coding
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      if (score >= 85) {
        doc.setTextColor(...successColor);
      } else if (score >= 70) {
        doc.setTextColor(...secondaryColor);
      } else if (score >= 50) {
        doc.setTextColor(...warningColor);
      } else {
        doc.setTextColor(...errorColor);
      }
      doc.text(`Overall Score: ${score}/100`, 20, 175);
      doc.text(`Recommendation: ${recommendation}`, 20, 185);
      
      // Security Violations Table
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Security Violations Summary', 20, 205);
      
      if (violationData.length > 0) {
        // Table headers with colored background
        doc.setFillColor(240, 240, 240);
        doc.rect(20, 215, 170, 10, 'F');
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Violation Type', 25, 222);
        doc.text('Count', 80, 222);
        doc.text('Impact', 110, 222);
        doc.text('Recommendation', 140, 222);
        
        // Table data
        let yPos = 232;
        violationData.forEach((violation, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          
          // Alternate row colors
          if (index % 2 === 0) {
            doc.setFillColor(248, 248, 248);
            doc.rect(20, yPos - 7, 170, 10, 'F');
          }
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          
          // Color code the violation type
          if (violation.type === 'error') {
            doc.setTextColor(...errorColor);
          } else {
            doc.setTextColor(...warningColor);
          }
          
          const violationType = violation.fullName.length > 25 
            ? violation.fullName.substring(0, 25) + '...' 
            : violation.fullName;
          doc.text(violationType, 25, yPos);
          
          doc.setTextColor(0, 0, 0);
          doc.text(violation.value.toString(), 80, yPos);
          doc.text(violation.impact, 110, yPos);
          
          const recommendation = violation.recommendation.length > 20 
            ? violation.recommendation.substring(0, 20) + '...' 
            : violation.recommendation;
          doc.text(recommendation, 140, yPos);
          
          yPos += 12;
        });
      } else {
        doc.setTextColor(...successColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('No security violations detected - Excellent compliance!', 20, 225);
      }
      
      // Add footer with timestamp
      doc.setTextColor(128, 128, 128);
      doc.setFontSize(8);
      doc.text(`Report generated on: ${new Date().toLocaleString()}`, 20, 285);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `proctored-interview-report-${candidateDetails.fullName.replace(/\s+/g, '-')}-${timestamp}.pdf`;
      
      console.log('Saving colored PDF with filename:', filename);
      doc.save(filename);
      
      console.log('Enhanced PDF with colors generated successfully');
    } catch (error) {
      console.error('Error generating enhanced PDF:', error);
      alert('There was an error generating the PDF report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AI Proctored Interview Report</h1>
                <p className="text-sm text-gray-600">Comprehensive Assessment Results</p>
              </div>
            </div>
            <button
              onClick={generatePDF}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Candidate Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-600" />
            Candidate Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{candidateDetails.fullName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{candidateDetails.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{candidateDetails.phoneNumber}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Skills:</span>
                <p className="font-medium">{candidateDetails.skills}</p>
              </div>
              <div>
                <span className="text-gray-600">Experience:</span>
                <p className="font-medium">{candidateDetails.experience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Duration</h3>
                <p className="text-2xl font-bold text-blue-600">{duration} min</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
                <p className="text-2xl font-bold text-green-600">{answeredQuestions}/{totalQuestions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Violations</h3>
                <p className="text-2xl font-bold text-orange-600">{violationLogs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-600" />
            AI Recommendation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                <div className="text-4xl font-bold text-purple-600 mb-2">{score}/100</div>
                <div className="text-lg font-semibold text-gray-700">Overall Score</div>
              </div>
            </div>
            <div>
              <div className={`text-center p-6 rounded-xl ${
                recommendation === 'Highly Recommended' ? 'bg-green-50 text-green-700' :
                recommendation === 'Recommended' ? 'bg-blue-50 text-blue-700' :
                recommendation === 'Conditionally Recommended' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              }`}>
                <div className="text-2xl font-bold mb-2">{recommendation}</div>
                <div className="text-sm">Based on interview performance and security compliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Violations Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-purple-600" />
            Security Violations Table
          </h2>
          
          {violationData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Violation Type</TableHead>
                    <TableHead className="font-semibold">Occurrences</TableHead>
                    <TableHead className="font-semibold">Impact Level</TableHead>
                    <TableHead className="font-semibold">First Detected</TableHead>
                    <TableHead className="font-semibold">Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violationData.map((violation, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            violation.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <span>{violation.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          violation.value > 3 
                            ? 'bg-red-100 text-red-800' 
                            : violation.value > 1 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {violation.value}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          violation.impact === 'High'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {violation.impact}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {violation.timestamps[0]?.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {violation.recommendation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Perfect Security Compliance</h3>
              <p className="text-gray-600">No security violations detected during the interview</p>
            </div>
          )}
        </div>

        {/* Violation Analysis with Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Security Violation Analysis</h2>
          
          {violationData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Violation Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={violationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {violationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} occurrences`,
                          props.payload.fullName
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Violation Statistics</h3>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-red-700 font-medium">Critical Violations</span>
                      <span className="text-red-600 font-bold">
                        {violationLogs.filter(log => log.type === 'error').length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-700 font-medium">Warning Violations</span>
                      <span className="text-yellow-600 font-bold">
                        {violationLogs.filter(log => log.type === 'warning').length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-medium">Total Violations</span>
                      <span className="text-blue-600 font-bold">{violationLogs.length}</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 font-medium">Compliance Rate</span>
                      <span className="text-green-600 font-bold">
                        {Math.max(0, 100 - (violationLogs.length * 5)).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Perfect Security Compliance</h3>
              <p className="text-gray-600">No security violations detected during the interview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProctoredInterviewReport;

```
