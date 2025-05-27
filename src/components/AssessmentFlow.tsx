
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ParticleBackground from './ParticleBackground';

interface AssessmentFlowProps {
  onBack: () => void;
}

interface FormData {
  // Personal Info
  fullName: string;
  email: string;
  phoneNumber: string;
  
  // Professional Info
  skills: string;
  experience: string;
  cv: File | null;
  jobDescription: string;
  
  // Test Configuration
  totalQuestions: number;
  codingQuestions: number;
  timeFrame: number;
  scheduleForLater: boolean;
  scheduledDate?: string;
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    skills: '',
    experience: '',
    cv: null,
    jobDescription: '',
    totalQuestions: 10,
    codingQuestions: 3,
    timeFrame: 60,
    scheduleForLater: false,
    scheduledDate: ''
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleInputChange('cv', file);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStartTest = () => {
    console.log('Starting test with data:', formData);
    // Here you would typically start the actual test
    alert('Test started! (This would redirect to the actual test interface)');
  };

  const renderStep1 = () => (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-slate-300">Email ID</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            placeholder="Enter your email address"
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber" className="text-slate-300">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            placeholder="Enter your phone number"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Professional Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="skills" className="text-slate-300">Skills</Label>
          <Textarea
            id="skills"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            placeholder="List your technical skills (e.g., JavaScript, React, Python, etc.)"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="experience" className="text-slate-300">Experience</Label>
          <Textarea
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            placeholder="Describe your work experience and projects"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="cv" className="text-slate-300">Upload Your CV</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="bg-slate-700/50 border-slate-600 text-white file:text-slate-300"
            />
            <Upload className="w-5 h-5 text-slate-400" />
          </div>
          {formData.cv && (
            <p className="text-sm text-green-400 mt-1">
              File uploaded: {formData.cv.name}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="jobDescription" className="text-slate-300">Job Description</Label>
          <Textarea
            id="jobDescription"
            value={formData.jobDescription}
            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            placeholder="Paste the job description you're applying for (optional)"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Test Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="totalQuestions" className="text-slate-300">Number of Questions</Label>
          <div className="flex items-center space-x-4 mt-2">
            <Input
              id="totalQuestions"
              type="number"
              min="5"
              max="50"
              value={formData.totalQuestions}
              onChange={(e) => handleInputChange('totalQuestions', parseInt(e.target.value))}
              className="bg-slate-700/50 border-slate-600 text-white w-24"
            />
            <span className="text-slate-400">questions total</span>
          </div>
        </div>
        <div>
          <Label htmlFor="codingQuestions" className="text-slate-300">Number of Coding Questions</Label>
          <div className="flex items-center space-x-4 mt-2">
            <Input
              id="codingQuestions"
              type="number"
              min="0"
              max="10"
              value={formData.codingQuestions}
              onChange={(e) => handleInputChange('codingQuestions', parseInt(e.target.value))}
              className="bg-slate-700/50 border-slate-600 text-white w-24"
            />
            <span className="text-slate-400">coding questions</span>
          </div>
        </div>
        <div>
          <Label htmlFor="timeFrame" className="text-slate-300">Time Frame (minutes)</Label>
          <div className="flex items-center space-x-4 mt-2">
            <Input
              id="timeFrame"
              type="number"
              min="30"
              max="180"
              value={formData.timeFrame}
              onChange={(e) => handleInputChange('timeFrame', parseInt(e.target.value))}
              className="bg-slate-700/50 border-slate-600 text-white w-24"
            />
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">minutes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Schedule Your Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="startNow"
              name="schedule"
              checked={!formData.scheduleForLater}
              onChange={() => handleInputChange('scheduleForLater', false)}
              className="text-blue-500"
            />
            <Label htmlFor="startNow" className="text-slate-300">Start the test now</Label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="scheduleLater"
              name="schedule"
              checked={formData.scheduleForLater}
              onChange={() => handleInputChange('scheduleForLater', true)}
              className="text-blue-500"
            />
            <Label htmlFor="scheduleLater" className="text-slate-300">Schedule for later</Label>
          </div>
        </div>
        
        {formData.scheduleForLater && (
          <div>
            <Label htmlFor="scheduledDate" className="text-slate-300">Select Date & Time</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        )}

        <div className="bg-slate-700/30 p-4 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Test Summary</h4>
          <div className="text-slate-300 space-y-1 text-sm">
            <p>• {formData.totalQuestions} total questions</p>
            <p>• {formData.codingQuestions} coding questions</p>
            <p>• {formData.timeFrame} minutes duration</p>
            <p>• {formData.scheduleForLater ? 'Scheduled for later' : 'Starting immediately'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Journey
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Assessment - Level 1</h1>
            <div className="flex justify-center space-x-3 mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === currentStep
                      ? 'bg-blue-500 text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-600 text-slate-300'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <p className="text-slate-400">
              Step {currentStep} of 4: {
                currentStep === 1 ? 'Personal Information' :
                currentStep === 2 ? 'Professional Details' :
                currentStep === 3 ? 'Test Configuration' :
                'Schedule Test'
              }
            </p>
          </div>

          <div className="mb-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleStartTest}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {formData.scheduleForLater ? 'Schedule Test' : 'Start Test'}
                <FileText className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentFlow;
