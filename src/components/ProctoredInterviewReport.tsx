
import React from 'react';
import { ArrowLeft, Download, Clock, User, Mail, Phone, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
  // Process violation data for pie chart
  const processViolationData = () => {
    const violationCounts: { [key: string]: number } = {};
    
    violationLogs.forEach(log => {
      const key = log.message;
      violationCounts[key] = (violationCounts[key] || 0) + 1;
    });

    return Object.entries(violationCounts).map(([name, value]) => ({
      name: name.length > 30 ? name.substring(0, 30) + '...' : name,
      value,
      fullName: name
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
      console.log('Starting PDF generation...');
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Proctored Interview Report', 20, 20);
      
      // Candidate Information
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Candidate Information', 20, 40);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${candidateDetails.fullName}`, 20, 50);
      doc.text(`Email: ${candidateDetails.email}`, 20, 60);
      doc.text(`Phone: ${candidateDetails.phoneNumber}`, 20, 70);
      doc.text(`Skills: ${candidateDetails.skills}`, 20, 80);
      doc.text(`Experience: ${candidateDetails.experience}`, 20, 90);
      
      // Interview Details
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Interview Details', 20, 110);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${interviewStartTime.toLocaleDateString()}`, 20, 120);
      doc.text(`Duration: ${duration} minutes`, 20, 130);
      doc.text(`Questions: ${answeredQuestions}/${totalQuestions}`, 20, 140);
      
      // AI Recommendation
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Recommendation', 20, 160);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Score: ${score}/100`, 20, 170);
      doc.text(`Recommendation: ${recommendation}`, 20, 180);
      
      // Face Detection Analysis
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Face Detection Analysis', 20, 200);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      const errorViolations = violationLogs.filter(log => log.type === 'error').length;
      const warningViolations = violationLogs.filter(log => log.type === 'warning').length;
      
      let securityStatus = 'Excellent';
      if (errorViolations > 0) {
        securityStatus = 'Poor';
      } else if (warningViolations > 0) {
        securityStatus = 'Fair';
      }
      
      doc.text(`Security Monitoring Status for ${candidateDetails.fullName} - ${securityStatus}`, 20, 210);
      
      // Violation summary
      const multipleFaceViolations = violationLogs.filter(v => 
        v.message.toLowerCase().includes('multiple') || v.message.toLowerCase().includes('face')
      );
      const noFaceViolations = violationLogs.filter(v => 
        v.message.toLowerCase().includes('no face') || v.message.toLowerCase().includes('not visible')
      );
      
      if (multipleFaceViolations.length > 0) {
        doc.text(`Multiple people detected: ${multipleFaceViolations.length} time(s) - High - Potential security concern`, 20, 220);
      }
      
      if (noFaceViolations.length > 0) {
        doc.text(`No face detected: ${noFaceViolations.length} time(s) - Medium - Engagement concern`, 20, 230);
      }
      
      if (multipleFaceViolations.length === 0 && noFaceViolations.length === 0) {
        doc.text('No issues detected: 0 time(s) - None', 20, 220);
      }
      
      // Violation Details Table
      if (violationData.length > 0) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Security Violations', 20, 250);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Table headers
        doc.text('Issue', 20, 260);
        doc.text('Occurrences', 100, 260);
        doc.text('Impact', 140, 260);
        doc.text('Recommendation', 170, 260);
        
        // Table data
        let yPos = 270;
        violationData.forEach((item, index) => {
          if (yPos > 270) { // Add new page if needed
            doc.addPage();
            yPos = 20;
          }
          
          const issue = item.fullName.length > 25 ? item.fullName.substring(0, 25) + '...' : item.fullName;
          doc.text(issue, 20, yPos);
          doc.text(item.value.toString(), 100, yPos);
          
          const impact = item.value > 3 ? 'High' : item.value > 1 ? 'Medium' : 'Low';
          doc.text(impact, 140, yPos);
          
          const recommendation = item.fullName.toLowerCase().includes('multiple') 
            ? 'Ensure you are alone' 
            : 'Stay visible in camera';
          doc.text(recommendation, 170, yPos);
          
          yPos += 10;
        });
      }
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `interview-report-${candidateDetails.fullName.replace(/\s+/g, '-')}-${timestamp}.pdf`;
      
      console.log('Saving PDF with filename:', filename);
      
      // Save the PDF
      doc.save(filename);
      
      console.log('PDF generated and download initiated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
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
