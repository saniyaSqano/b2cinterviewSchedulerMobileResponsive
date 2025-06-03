import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Code, Shield, Star, Users, MessageCircle, Zap, AlertTriangle, CheckCircle, Award, XCircle, TrendingUp, BarChart3, Upload, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { uploadToS3, uploadPitchPerfectToS3 } from '../utils/s3Service';
import { supabase } from '../integrations/supabase/client';
import jsPDF from 'jspdf';
import { v4 as uuidv4 } from 'uuid';

interface ViolationLog {
  id: number;
  type: 'warning' | 'error';
  message: string;
  timestamp: Date;
}

interface SkillAssessment {
  programming: number;
  framework: number;
  testing: number;
  confidence: number;
  leadership: number;
  communication: number;
  adaptability: number;
}

interface InterviewReportProps {
  candidateDetails: {
    fullName: string;
    email: string;
    phoneNumber: string;
    skills: string;
    experience: string;
  };
  skillAssessment: SkillAssessment;
  violationLogs: ViolationLog[];
  onBack: () => void;
  reportType?: 'ai_proctor' | 'pitch_perfect' | 'assessment' | 'self_practice';
}

const InterviewReport: React.FC<InterviewReportProps> = ({
  candidateDetails,
  skillAssessment,
  violationLogs,
  onBack,
  reportType = 'ai_proctor'
}) => {
  // Try to retrieve stored user data from localStorage
  const [storedUserData, setStoredUserData] = useState<{email: string, fullName: string} | null>(null);
  
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('currentUserData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Retrieved user data from localStorage:', parsedData);
        setStoredUserData(parsedData);
      }
    } catch (error) {
      console.error('Error retrieving user data from localStorage:', error);
    }
  }, []);
  // Report states
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  
  // Function to save report URL to Supabase
  const saveReportToDatabase = async (reportUrl: string, reportType: string) => {
    try {
      // Use stored user data if available, otherwise fall back to candidateDetails
      const email = storedUserData?.email || candidateDetails.email;
      const fullName = storedUserData?.fullName || candidateDetails.fullName;
      
      console.log('Saving report to database...', { 
        reportUrl, 
        reportType, 
        email, 
        fullName
      });
      
      if (!email) {
        throw new Error('Cannot save report: No email address provided');
      }
      
      // Map report type to column name
      const columnMap: Record<string, string> = {
        'ai_proctor': 'ai_proctor_report',
        'pitch_perfect': 'pitch_perfect_report',
        'assessment': 'assessment_report',
        'self_practice': 'self_practice_report'
      };
      
      const columnName = columnMap[reportType];
      console.log('Column mapping details:', { reportType, mappedColumn: columnName });
      
      if (!columnName) {
        throw new Error(`Unknown report type: ${reportType}`);
      }
      
      // Check if the user exists by email
      const { data: existingUser, error: fetchError } = await supabase
        .from('ai_procto_users')
        .select('*')
        .eq('email', email)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is 'not found'
        console.error('Error fetching user:', fetchError);
        throw fetchError;
      }
      
      let result;
      
      if (!existingUser) {
        // User doesn't exist, create a new user with the report URL
        console.log('User not found, creating new user with report...');
        
        // No need to generate a user_id anymore since we're using email as the primary identifier
        console.log('Creating new user with email:', email);
        
        console.log('Creating new user with report data:', {
          email,
          columnName,
          reportUrl,
          dynamicInsert: { [columnName]: reportUrl }
        });
        
        // No longer need to generate a user_id as it's been removed from the database schema
        
        const userData = {
          email: email,
          first_name: fullName.split(' ')[0],
          last_name: fullName.split(' ').slice(1).join(' '),
          password_hash: 'placeholder',
          policies_accepted: true,
          [columnName]: reportUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log('Full user data being inserted:', userData);
        
        const { data, error } = await supabase
          .from('ai_procto_users')
          .insert(userData)
          .select()
          .single();
          
        if (error) {
          console.error('Error creating user with report:', error);
          throw error;
        }
        
        result = data;
      } else {
        // If user exists, update the report URL
        console.log('User found, updating with report URL...');
        
        // Create an update query using email as the identifier
        console.log('Updating user record with:', {
          email,
          columnName,
          reportUrl,
          dynamicUpdate: { [columnName]: reportUrl }
        });
        
        let updateQuery = supabase
          .from('ai_procto_users')
          .update({
            [columnName]: reportUrl,
            updated_at: new Date().toISOString()
          })
          .eq('email', email);
        
        const { data, error } = await updateQuery.select().single();
        
        if (error) {
          console.error('Error updating user with report:', error);
          throw error;
        }
        
        result = data;
      }
      
      console.log('Report saved to database successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to save report to database:', error);
      throw error;
    }
  };
  
  // Function to generate and download the report as PDF and upload to S3
  const generateAndDownloadReport = async () => {
    try {
      setIsGeneratingReport(true);
      setIsUploading(true);
      
      // Create a new PDF document
      const pdf = new jsPDF();
      
      // Define colors for the PDF
      const colors = {
        primary: [0, 102, 204], // Blue
        secondary: [102, 102, 102], // Gray
        accent: [255, 153, 0], // Orange
        success: [0, 153, 51], // Green
        warning: [204, 51, 0] // Red
      };
      
      // Add title
      pdf.setFontSize(22);
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.text('Interview Report', 105, 20, { align: 'center' });
      
      // Add date
      pdf.setFontSize(12);
      pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
      
      // Add line
      pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.line(20, 35, 190, 35);
      
      let yPos = 45;
      
      // Add candidate details section
      pdf.setFontSize(16);
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.text('Candidate Details', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Name: ${candidateDetails.fullName}`, 20, yPos);
      yPos += 7;
      pdf.text(`Email: ${candidateDetails.email}`, 20, yPos);
      yPos += 7;
      pdf.text(`Phone: ${candidateDetails.phoneNumber}`, 20, yPos);
      yPos += 7;
      pdf.text(`Skills: ${candidateDetails.skills}`, 20, yPos);
      yPos += 7;
      pdf.text(`Experience: ${candidateDetails.experience} years`, 20, yPos);
      yPos += 15;
      
      // Add skill assessment section
      pdf.setFontSize(16);
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.text('Skill Assessment', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      
      // Add each skill with score
      Object.entries(skillAssessment).forEach(([skill, score]) => {
        pdf.text(`${skill}: ${score}/10`, 20, yPos);
        yPos += 7;
      });
      
      yPos += 8;
      
      // Add violations section
      pdf.setFontSize(16);
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.text('Violations Detected', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      
      if (violationLogs.length === 0) {
        pdf.text('No violations detected during the interview.', 20, yPos);
        yPos += 7;
      } else {
        // Add each violation
        violationLogs.forEach((violation, index) => {
          pdf.text(`${index + 1}. ${violation.type} at ${new Date(violation.timestamp).toLocaleTimeString()}`, 20, yPos);
          yPos += 7;
          
          // Add violation details with proper wrapping
          const detailLines = pdf.splitTextToSize(`   Details: ${violation.message}`, 170);
          pdf.text(detailLines, 20, yPos);
          yPos += detailLines.length * 7 + 3;
        });
      }
      
      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      pdf.text('Report generated by AI Interview Assistant', 105, 285, { align: 'center' });
      
      // Generate PDF as blob
      const pdfBlob = pdf.output('blob');
      const fileName = `Interview-Report-${candidateDetails.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Create a download link and trigger download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Upload to S3 using the appropriate upload function based on report type
      console.log(`Uploading ${reportType} report to S3...`);
      let s3Url: string;
      
      if (reportType === 'pitch_perfect') {
        s3Url = await uploadPitchPerfectToS3(pdfBlob, fileName, 'application/pdf');
      } else {
        s3Url = await uploadToS3(pdfBlob, fileName, 'application/pdf');
      }
      
      console.log(`${reportType} report uploaded to S3:`, s3Url);
      
      // Save the report URL to the database
      try {
        console.log(`Attempting to save ${reportType} report to database with URL:`, s3Url);
        console.log('Report type:', reportType);
        console.log('Column mapping:', reportType === 'pitch_perfect' ? 'pitch_perfect_report' : 'other column');
        
        const savedData = await saveReportToDatabase(s3Url, reportType);
        
        // Update state with success and URL
        setUploadSuccess(true);
        setUploadUrl(s3Url);
        console.log('Report generated, downloaded, uploaded, and saved to database successfully', savedData);
        
        // Show a success notification to the user
        alert(`Report successfully saved to database for ${candidateDetails.fullName}!`);
      } catch (dbError) {
        console.error('Error saving report to database:', dbError);
        alert(`Report generated and uploaded to S3, but there was an error saving to the database: ${dbError.message}`);
      }
    } catch (error) {
      console.error('Error generating and uploading PDF report:', error);
      alert(`Error generating report: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Calculate final result based on violations
  const errorViolations = violationLogs.filter(log => log.type === 'error').length;
  const warningViolations = violationLogs.filter(log => log.type === 'warning').length;
  
  const getFinalResult = () => {
    if (errorViolations >= 3) {
      return {
        status: 'disqualified',
        message: 'Interview Disqualified - Multiple security violations detected',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-500',
        icon: XCircle
      };
    } else if (errorViolations >= 1 || warningViolations >= 5) {
      return {
        status: 'needs_review',
        message: 'Requires Manual Review - Violations detected during interview',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-500',
        icon: AlertTriangle
      };
    } else {
      return {
        status: 'passed',
        message: 'Interview Completed Successfully - No significant violations',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-500',
        icon: Award
      };
    }
  };

  const finalResult = getFinalResult();
  const ResultIcon = finalResult.icon;

  const getSkillLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const averageScore = Math.round(
    (skillAssessment.programming + skillAssessment.framework + skillAssessment.testing + 
     skillAssessment.confidence + skillAssessment.leadership + skillAssessment.communication + 
     skillAssessment.adaptability) / 7
  );

  // Prepare data for charts
  const skillsData = [
    { skill: 'Programming', score: skillAssessment.programming, fullMark: 100 },
    { skill: 'Framework', score: skillAssessment.framework, fullMark: 100 },
    { skill: 'Testing', score: skillAssessment.testing, fullMark: 100 },
    { skill: 'Confidence', score: skillAssessment.confidence, fullMark: 100 },
    { skill: 'Leadership', score: skillAssessment.leadership, fullMark: 100 },
    { skill: 'Communication', score: skillAssessment.communication, fullMark: 100 },
    { skill: 'Adaptability', score: skillAssessment.adaptability, fullMark: 100 }
  ];

  const violationData = [
    { name: 'No Violations', value: Math.max(0, 10 - errorViolations - warningViolations), fill: '#22c55e' },
    { name: 'Warnings', value: warningViolations, fill: '#eab308' },
    { name: 'Errors', value: errorViolations, fill: '#ef4444' }
  ];

  const performanceMetrics = [
    { category: 'Technical Skills', score: Math.round((skillAssessment.programming + skillAssessment.framework + skillAssessment.testing) / 3) },
    { category: 'Soft Skills', score: Math.round((skillAssessment.confidence + skillAssessment.leadership + skillAssessment.communication + skillAssessment.adaptability) / 4) },
    { category: 'Compliance', score: Math.max(0, 100 - (errorViolations * 20 + warningViolations * 5)) }
  ];

  const chartConfig = {
    score: { label: 'Score', color: '#3b82f6' },
    violations: { label: 'Violations', color: '#ef4444' },
    performance: { label: 'Performance', color: '#22c55e' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
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
                AI Proctored Interview Report
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive Analysis & Assessment</p>
            </div>
            <div className="w-12"></div>
          </div>

          {/* Final Result Card */}
          <Card className={`${finalResult.bgColor} ${finalResult.borderColor} border-2 shadow-xl animate-fade-in`} style={{ animationDelay: '200ms' }}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 rounded-full ${finalResult.bgColor} border-4 ${finalResult.borderColor} flex items-center justify-center shadow-lg`}>
                  <ResultIcon className={`w-10 h-10 ${finalResult.color}`} />
                </div>
              </div>
              <CardTitle className={`text-3xl ${finalResult.color} mb-4`}>
                {finalResult.message}
              </CardTitle>
              <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{averageScore}%</div>
                  <div className="text-gray-600">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{errorViolations}</div>
                  <div className="text-gray-600">Critical Issues</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">{warningViolations}</div>
                  <div className="text-gray-600">Warnings</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Skills Radar Chart */}
            <Card className="bg-white shadow-xl animate-fade-in xl:col-span-2" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  Skills Assessment Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <RadarChart data={skillsData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" className="text-sm" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                    <Radar 
                      name="Skills" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Violation Pie Chart */}
            <Card className="bg-white shadow-xl animate-fade-in" style={{ animationDelay: '600ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="w-6 h-6 text-purple-600" />
                  Compliance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <PieChart>
                    <Pie
                      data={violationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {violationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="flex justify-center gap-4 text-sm mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Clean</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Warnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Errors</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics Bar Chart */}
          <Card className="bg-white shadow-xl animate-fade-in" style={{ animationDelay: '800ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="w-6 h-6 text-green-600" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <BarChart data={performanceMetrics}>
                  <XAxis dataKey="category" className="text-sm" />
                  <YAxis domain={[0, 100]} className="text-sm" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Candidate Details and Detailed Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Candidate Details */}
            <Card className="bg-white shadow-xl animate-fade-in" style={{ animationDelay: '1000ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-6 h-6 text-blue-600" />
                  Candidate Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-semibold text-lg">{candidateDetails.fullName}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-semibold">{candidateDetails.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-semibold">{candidateDetails.phoneNumber}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Skills</p>
                    <p className="font-semibold">{candidateDetails.skills}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Experience</p>
                    <p className="font-semibold">{candidateDetails.experience}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Skill Assessment */}
            <Card className="bg-white shadow-xl animate-fade-in" style={{ animationDelay: '1200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="w-6 h-6 text-yellow-600" />
                  Detailed Skill Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Programming Skills', score: skillAssessment.programming, icon: Code },
                  { name: 'Framework Knowledge', score: skillAssessment.framework, icon: Shield },
                  { name: 'Testing & QA', score: skillAssessment.testing, icon: CheckCircle },
                  { name: 'Confidence Level', score: skillAssessment.confidence, icon: Star },
                  { name: 'Leadership Skills', score: skillAssessment.leadership, icon: Users },
                  { name: 'Communication', score: skillAssessment.communication, icon: MessageCircle },
                  { name: 'Adaptability', score: skillAssessment.adaptability, icon: Zap }
                ].map((skill) => {
                  const skillLevel = getSkillLevel(skill.score);
                  const SkillIcon = skill.icon;
                  return (
                    <div key={skill.name} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <SkillIcon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">{skill.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{skill.score}%</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${skillLevel.bgColor} ${skillLevel.color}`}>
                            {skillLevel.level}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Violation Results */}
          <Card className="bg-white shadow-xl animate-fade-in" style={{ animationDelay: '1400ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="w-6 h-6 text-red-600" />
                Proctoring Violation Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {violationLogs.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <p className="text-green-600 font-bold text-xl mb-2">Perfect Compliance Record</p>
                  <p className="text-gray-500">No violations detected during the interview</p>
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-700 font-medium">🏆 Excellent proctoring compliance demonstrates integrity and professionalism</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-600">{errorViolations}</div>
                      <div className="text-red-600 font-medium">Critical Errors</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-600">{warningViolations}</div>
                      <div className="text-yellow-600 font-medium">Warnings</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{violationLogs.length}</div>
                      <div className="text-blue-600 font-medium">Total Events</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-600">{Math.max(0, 100 - (errorViolations * 20 + warningViolations * 5))}%</div>
                      <div className="text-gray-600 font-medium">Compliance</div>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto space-y-3">
                    {violationLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${
                          log.type === 'error' 
                            ? 'bg-red-50 border-red-500 border-l-red-500' 
                            : 'bg-yellow-50 border-yellow-500 border-l-yellow-500'
                        }`}
                      >
                        <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                          log.type === 'error' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className={`font-semibold ${
                              log.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                            }`}>
                              {log.message}
                            </p>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                              log.type === 'error' 
                                ? 'bg-red-200 text-red-800' 
                                : 'bg-yellow-200 text-yellow-800'
                            }`}>
                              {log.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            📅 {formatTimestamp(log.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '1600ms' }}>
            {/* Message */}
            <div className="text-center">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-700">
                <p className="font-medium">Your interview report is ready! Click the button below to download it.</p>
              </div>
            </div>
            
            {/* S3 Upload Status */}
            <div className="text-center">
              {isUploading && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 flex items-center justify-center space-x-2">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <p className="font-medium">Uploading report to secure cloud storage...</p>
                </div>
              )}
              
              {uploadSuccess && uploadUrl && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-purple-700">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Check className="w-5 h-5 text-purple-600" />
                    <p className="font-medium">Report successfully saved to secure cloud storage!</p>
                  </div>
                  <a 
                    href={uploadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:text-purple-800 underline flex items-center justify-center space-x-1"
                  >
                    <Upload className="w-4 h-4" />
                    <span>View Cloud Report</span>
                  </a>
                </div>
              )}
            </div>
            
            {/* Buttons */}
            <div className="flex justify-center gap-6">
              <Button
                onClick={onBack}
                className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-full text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Back to Dashboard
              </Button>
              
              <Button
                onClick={generateAndDownloadReport}
                variant="outline"
                className="px-8 py-4 rounded-full text-lg font-medium border-2 border-green-300 text-green-600 hover:bg-green-50 shadow-lg transform hover:scale-105 transition-all duration-200"
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? '⏳ Preparing Download...' : '📥 Download Report'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;
