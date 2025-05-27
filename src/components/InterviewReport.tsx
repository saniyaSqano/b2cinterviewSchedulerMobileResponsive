
import React from 'react';
import { ArrowLeft, User, Code, Shield, Star, Users, MessageCircle, Zap, AlertTriangle, CheckCircle, Award, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
}

const InterviewReport: React.FC<InterviewReportProps> = ({
  candidateDetails,
  skillAssessment,
  violationLogs,
  onBack
}) => {
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
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600' };
    if (score >= 40) return { level: 'Average', color: 'text-yellow-600' };
    return { level: 'Needs Improvement', color: 'text-red-600' };
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-lg border"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">AI Proctored Interview Report</h1>
            <div className="w-10"></div>
          </div>

          {/* Final Result Card */}
          <Card className={`${finalResult.bgColor} ${finalResult.borderColor} border-2 shadow-lg`}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full ${finalResult.bgColor} border-2 ${finalResult.borderColor} flex items-center justify-center`}>
                  <ResultIcon className={`w-8 h-8 ${finalResult.color}`} />
                </div>
              </div>
              <CardTitle className={`text-2xl ${finalResult.color}`}>
                {finalResult.message}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">
                Overall Assessment Score: <span className="font-bold text-xl">{averageScore}%</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Violations: {errorViolations} errors, {warningViolations} warnings
              </p>
            </CardContent>
          </Card>

          {/* Candidate Details and Skill Assessment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Candidate Details */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Candidate Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold">{candidateDetails.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{candidateDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{candidateDetails.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skills</p>
                  <p className="font-semibold">{candidateDetails.skills}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-semibold">{candidateDetails.experience}</p>
                </div>
              </CardContent>
            </Card>

            {/* Skill Assessment */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Skill Assessment
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
                    <div key={skill.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SkillIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${skill.score}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${skillLevel.color}`}>
                          {skill.score}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Violation Results */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Proctoring Violation Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {violationLogs.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-green-600 font-semibold">No violations detected during the interview</p>
                  <p className="text-gray-500 text-sm">Excellent proctoring compliance</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Violation Summary</h4>
                    <div className="flex gap-4">
                      <span className="text-red-600 font-medium">
                        {errorViolations} Errors
                      </span>
                      <span className="text-yellow-600 font-medium">
                        {warningViolations} Warnings
                      </span>
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {violationLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          log.type === 'error' 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                          log.type === 'error' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            log.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                          }`}>
                            {log.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimestamp(log.timestamp)}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          log.type === 'error' 
                            ? 'bg-red-200 text-red-800' 
                            : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {log.type.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={onBack}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="px-8 py-3 rounded-full"
            >
              Print Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;
