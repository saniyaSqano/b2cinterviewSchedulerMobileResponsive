import React from 'react';
import { X, Download, User, Mail, Phone, Award, Star, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import jsPDF from 'jspdf';

interface SelfPracticeReportProps {
  onClose: () => void;
  userDetails: {
    fullName: string;
    email: string;
    phoneNumber: string;
    skills: string;
    experience: string;
  };
}

const SelfPracticeReport: React.FC<SelfPracticeReportProps> = ({ onClose, userDetails }) => {
  // Function to generate and download PDF report
  const generatePdfReport = () => {
    const pdf = new jsPDF();
    const colors = {
      primary: [75, 85, 99], // gray-600
      secondary: [79, 70, 229], // indigo-600
      accent: [16, 185, 129] // emerald-500
    };
    
    // Add header with user details
    pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text('SELF-PRACTICE PERFORMANCE REPORT', 105, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Candidate: ${userDetails.fullName}`, 15, 30);
    pdf.text(`Email: ${userDetails.email || 'N/A'}`, 15, 37);
    pdf.text(`Phone: ${userDetails.phoneNumber || 'N/A'}`, 15, 44);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 150, 30);
    
    // Executive Summary
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.text('Executive Summary', 15, 60);
    
    pdf.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.setLineWidth(0.5);
    pdf.line(15, 62, 195, 62);
    
    pdf.setFontSize(11);
    pdf.text('You demonstrated strong communication skills and preparation during your self-practice session.', 15, 70);
    pdf.text('Your responses were thoughtful and showed good self-awareness.', 15, 77);
    
    // Skills Assessment
    pdf.setFontSize(16);
    pdf.text('Skills Assessment', 15, 90);
    
    pdf.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.line(15, 92, 195, 92);
    
    const skills = [
      { name: 'Communication', score: 90 },
      { name: 'Technical Knowledge', score: 85 },
      { name: 'Problem Solving', score: 80 },
      { name: 'Adaptability', score: 85 },
      { name: 'Leadership', score: 75 }
    ];
    
    pdf.setFontSize(11);
    let yPos = 100;
    skills.forEach((skill, index) => {
      pdf.text(`${skill.name}:`, 15, yPos);
      
      // Draw skill bar
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(200, 200, 200);
      pdf.roundedRect(70, yPos - 4, 100, 5, 2, 2, 'F');
      
      pdf.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      pdf.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      pdf.roundedRect(70, yPos - 4, skill.score, 5, 2, 2, 'F');
      
      pdf.text(`${skill.score}%`, 175, yPos);
      
      yPos += 10;
    });
    
    // Strengths and Areas for Improvement
    yPos += 10;
    pdf.setFontSize(16);
    pdf.text('Strengths & Areas for Improvement', 15, yPos);
    
    pdf.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.line(15, yPos + 2, 195, yPos + 2);
    
    yPos += 10;
    pdf.setFontSize(14);
    pdf.text('Strengths:', 15, yPos);
    
    const strengths = [
      'Clear communication style',
      'Good preparation for common questions',
      'Professional demeanor'
    ];
    
    yPos += 8;
    pdf.setFontSize(11);
    strengths.forEach((strength, index) => {
      pdf.text(`• ${strength}`, 20, yPos);
      yPos += 7;
    });
    
    yPos += 5;
    pdf.setFontSize(14);
    pdf.text('Areas for Improvement:', 15, yPos);
    
    const weaknesses = [
      'Consider adding more specific examples',
      'Work on concise responses',
      'Practice more technical questions'
    ];
    
    yPos += 8;
    pdf.setFontSize(11);
    weaknesses.forEach((weakness, index) => {
      pdf.text(`• ${weakness}`, 20, yPos);
      yPos += 7;
    });
    
    // Recommendations
    yPos += 5;
    pdf.setFontSize(16);
    pdf.text('Recommendations', 15, yPos);
    
    pdf.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.line(15, yPos + 2, 195, yPos + 2);
    
    const recommendations = [
      'Continue practicing with more specific scenarios',
      'Record and review your responses to improve delivery',
      'Research company-specific questions for targeted preparation'
    ];
    
    yPos += 10;
    pdf.setFontSize(11);
    recommendations.forEach((recommendation, index) => {
      pdf.text(`${index + 1}. ${recommendation}`, 15, yPos);
      yPos += 7;
    });
    
    // Save the PDF
    const fileName = `Self-Practice-Report-${userDetails.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-auto w-full">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-indigo-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <h2 className="text-2xl font-bold mb-2">Self-Practice Performance Report</h2>
            <p className="text-indigo-100">Comprehensive Analysis & Assessment</p>
          </div>
        </div>

        {/* Candidate Details */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b">
          <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
            <User className="w-6 h-6 mr-2" />
            Candidate Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-gray-900 font-medium">{userDetails.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{userDetails.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900 font-medium">{userDetails.phoneNumber || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Skills</p>
                  <p className="text-gray-900 font-medium">{userDetails.skills || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-gray-900 font-medium">{userDetails.experience || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
            <Award className="w-6 h-6 mr-2" />
            Executive Summary
          </h3>
          <p className="text-gray-700 mb-4">
            You demonstrated strong communication skills and preparation during your self-practice session.
            Your responses were thoughtful and showed good self-awareness.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-md">
              <div className="text-3xl font-bold text-indigo-600">85%</div>
              <div className="text-gray-600">Overall Score</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md">
              <div className="text-3xl font-bold text-green-600">90%</div>
              <div className="text-gray-600">Communication</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md">
              <div className="text-3xl font-bold text-amber-600">80%</div>
              <div className="text-gray-600">Technical Knowledge</div>
            </div>
          </div>
        </div>

        {/* Strengths & Areas for Improvement */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
            <Star className="w-6 h-6 mr-2" />
            Strengths & Areas for Improvement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4 shadow-md">
              <h4 className="font-bold text-green-800 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Strengths
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-green-200 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-700" />
                  </div>
                  <span className="text-gray-700">Clear communication style</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-200 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-700" />
                  </div>
                  <span className="text-gray-700">Good preparation for common questions</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-200 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-700" />
                  </div>
                  <span className="text-gray-700">Professional demeanor</span>
                </li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 shadow-md">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-amber-600" />
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-amber-200 rounded-full p-1 mr-2 mt-0.5">
                    <XCircle className="w-3 h-3 text-amber-700" />
                  </div>
                  <span className="text-gray-700">Consider adding more specific examples</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-200 rounded-full p-1 mr-2 mt-0.5">
                    <XCircle className="w-3 h-3 text-amber-700" />
                  </div>
                  <span className="text-gray-700">Work on concise responses</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-200 rounded-full p-1 mr-2 mt-0.5">
                    <XCircle className="w-3 h-3 text-amber-700" />
                  </div>
                  <span className="text-gray-700">Practice more technical questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Recommendations
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 shadow-md">
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-800 font-bold text-sm">1</span>
                </div>
                <span className="text-gray-700">Continue practicing with more specific scenarios</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-800 font-bold text-sm">2</span>
                </div>
                <span className="text-gray-700">Record and review your responses to improve delivery</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-800 font-bold text-sm">3</span>
                </div>
                <span className="text-gray-700">Research company-specific questions for targeted preparation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={generatePdfReport}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelfPracticeReport;
