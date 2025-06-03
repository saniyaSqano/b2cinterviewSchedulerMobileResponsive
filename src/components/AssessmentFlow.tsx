
import React, { useState, useEffect } from 'react';
import { useAiProctoUser } from '../hooks/useAiProctoUser';
import { ChevronLeft, ChevronRight, Upload, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { v4 as uuidv4 } from 'uuid';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import ParticleBackground from './ParticleBackground';
import MCQTest from './MCQTest';
import TestReport from './TestReport';

interface AssessmentFlowProps {
  onBack: () => void;
  onTestPassed?: () => void;
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

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onBack, onTestPassed }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const { createUser, updateUserReport, loading, error } = useAiProctoUser();
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

  // Calculate time based on questions
  const calculateTimeFrame = (totalQuestions: number, codingQuestions: number) => {
    const mcqTime = (totalQuestions - codingQuestions) * 2; // 2 minutes per MCQ
    const codingTime = codingQuestions * 15; // 15 minutes per coding question
    const baseTime = 10; // 10 minutes buffer time
    return mcqTime + codingTime + baseTime;
  };

  useEffect(() => {
    const calculatedTime = calculateTimeFrame(formData.totalQuestions, formData.codingQuestions);
    setFormData(prev => ({ ...prev, timeFrame: calculatedTime }));
  }, [formData.totalQuestions, formData.codingQuestions]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleInputChange('cv', file);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleStartTest = async () => {
    console.log('Starting test with data:', formData);
    setIsTransitioning(true);
    
    try {
      // Validate required fields
      if (!formData.email || !formData.fullName) {
        throw new Error('Email and full name are required');
      }
      
      // Store email in localStorage for later use with reports
      setFormData(prev => ({
        ...prev
      }));
      
      const userData = {
        email: formData.email,
        password_hash: 'placeholder', // Using a placeholder since empty string might cause issues
        first_name: formData.fullName.split(' ')[0], // Extract first name
        last_name: formData.fullName.split(' ').slice(1).join(' '), // Extract last name
        policies_accepted: true
      };
      
      console.log('Attempting to save user data:', userData);
      
      // Save user data to Supabase
      const result = await createUser(userData);
      console.log('Supabase response:', result);
      
      // Store the user data in localStorage for persistence across components
      localStorage.setItem('currentUserData', JSON.stringify({
        email: formData.email,
        fullName: formData.fullName
      }));
      
      setSaveStatus('User data saved successfully!');
      
      // Show success feedback for 1.5 seconds before starting the test
      setTimeout(() => {
        setIsTransitioning(false);
        setShowTest(true);
      }, 1500);
    } catch (err) {
      console.error('Error saving user data:', err);
      setSaveStatus(`Error saving user data: ${err.message || 'Unknown error'}`);
      setIsTransitioning(false);
      
      // Still allow the test to start after showing error message for 2 seconds
      setTimeout(() => {
        setShowTest(true);
      }, 2000);
    }
  };

  const handleTestComplete = (results: any) => {
    console.log('Test completed with results:', results);
    setTestResults(results);
    setShowTest(false);
    setShowReport(true);
  };

  const handleBackFromTest = () => {
    setShowTest(false);
  };

  const handleBackFromReport = () => {
    setShowReport(false);
    if (testResults?.passed && onTestPassed) {
      onTestPassed();
    }
    onBack();
  };

  const handleRetakeTest = () => {
    setShowReport(false);
    setShowTest(true);
  };

  // Render feedback message when saving user data
  const renderFeedbackMessage = () => {
    if (!saveStatus) return null;
    
    const isError = saveStatus.includes('Error');
    const bgColor = isError ? 'bg-red-100' : 'bg-green-100';
    const textColor = isError ? 'text-red-700' : 'text-green-700';
    const borderColor = isError ? 'border-red-300' : 'border-green-300';
    const icon = isError ? '⚠️' : '✅';
    
    return (
      <div className={`${bgColor} ${textColor} ${borderColor} border p-4 rounded-md mb-6 animate-fade-in text-center`}>
        <p className="font-medium">{icon} {saveStatus}</p>
      </div>
    );
  };

  // If showing test report, render TestReport component
  if (showReport && testResults) {
    return (
      <TestReport
        results={testResults}
        candidateDetails={{
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          skills: formData.skills,
          experience: formData.experience
        }}
        onBack={handleBackFromReport}
        onRetakeTest={handleRetakeTest}
      />
    );
  }

  // If showing test, render MCQ component
  if (showTest) {
    return (
      <MCQTest
        totalQuestions={formData.totalQuestions - formData.codingQuestions} // Only MCQs for now
        timeFrame={formData.timeFrame}
        onBack={handleBackFromTest}
        onComplete={handleTestComplete}
      />
    );
  }

  const renderStep1 = () => (
    <div className={`max-w-2xl mx-auto text-center space-y-8 transition-all duration-500 ease-in-out ${
      isTransitioning ? 'opacity-0 transform translate-x-8' : 'opacity-100 transform translate-x-0'
    }`}>
      {saveStatus && renderFeedbackMessage()}
      <div className="mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help us personalize your experience</h1>
      </div>
      
      <div className="space-y-8">
        <div className="text-left transform transition-all duration-500 hover:scale-105">
          <Label htmlFor="fullName" className="text-gray-900 text-lg block mb-3">What's your name?</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="bg-white border-2 border-gray-300 text-gray-900 text-lg h-14 rounded-lg focus:border-blue-500 transition-all duration-300 focus:scale-105"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="text-left transform transition-all duration-500 hover:scale-105" style={{ animationDelay: '200ms' }}>
          <Label htmlFor="email" className="text-gray-900 text-lg block mb-3">What's your email?</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-white border-2 border-gray-300 text-gray-900 text-lg h-14 rounded-lg focus:border-blue-500 transition-all duration-300 focus:scale-105"
            placeholder="Enter your email address"
          />
        </div>
        
        <div className="text-left transform transition-all duration-500 hover:scale-105" style={{ animationDelay: '400ms' }}>
          <Label htmlFor="phoneNumber" className="text-gray-900 text-lg block mb-3">What's your phone number?</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="bg-white border-2 border-gray-300 text-gray-900 text-lg h-14 rounded-lg focus:border-blue-500 transition-all duration-300 focus:scale-105"
            placeholder="Enter your phone number"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={`max-w-2xl mx-auto text-center space-y-8 transition-all duration-500 ease-in-out ${
      isTransitioning ? 'opacity-0 transform translate-x-8' : 'opacity-100 transform translate-x-0'
    }`}>
      <div className="mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tell us about your professional background</h1>
      </div>
      
      <div className="space-y-8">
        <div className="text-left transform transition-all duration-500 hover:scale-105">
          <Label htmlFor="skills" className="text-gray-900 text-lg block mb-3">What are your key skills?</Label>
          <Textarea
            id="skills"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            className="bg-white border-2 border-gray-300 text-gray-900 text-lg min-h-[120px] rounded-lg focus:border-blue-500 transition-all duration-300"
            placeholder="List your technical skills (e.g., JavaScript, React, Python, etc.)"
          />
        </div>
        
        <div className="text-left transform transition-all duration-500 hover:scale-105" style={{ animationDelay: '200ms' }}>
          <Label htmlFor="experience" className="text-gray-900 text-lg block mb-3">Tell us about your experience</Label>
          <Textarea
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="bg-white border-2 border-gray-300 text-gray-900 text-lg min-h-[120px] rounded-lg focus:border-blue-500 transition-all duration-300"
            placeholder="Describe your work experience and projects"
          />
        </div>
        
        <div className="text-left transform transition-all duration-500 hover:scale-105" style={{ animationDelay: '400ms' }}>
          <Label htmlFor="cv" className="text-gray-900 text-lg block mb-3">Upload your CV</Label>
          <div className="relative">
            <Input
              id="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="bg-white border-2 border-gray-300 text-gray-900 text-lg h-14 rounded-lg focus:border-blue-500 file:text-white file:bg-blue-600 file:border-0 file:rounded file:px-4 file:py-2 file:mr-4 transition-all duration-300"
            />
            <Upload className="absolute right-4 top-4 w-6 h-6 text-gray-500 transition-colors duration-300 hover:text-blue-500" />
          </div>
          {formData.cv && (
            <p className="text-green-600 mt-2 text-sm animate-fade-in">File uploaded: {formData.cv.name}</p>
          )}
        </div>
        
        <div className="text-left transform transition-all duration-500 hover:scale-105" style={{ animationDelay: '600ms' }}>
          <Label htmlFor="jobDescription" className="text-gray-900 text-lg block mb-3">Job description (optional)</Label>
          <Textarea
            id="jobDescription"
            value={formData.jobDescription}
            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
            className="bg-white border-2 border-gray-300 text-gray-900 text-lg min-h-[120px] rounded-lg focus:border-blue-500 transition-all duration-300"
            placeholder="Paste the job description you're applying for"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={`max-w-2xl mx-auto text-center space-y-8 transition-all duration-500 ease-in-out ${
      isTransitioning ? 'opacity-0 transform translate-x-8' : 'opacity-100 transform translate-x-0'
    }`}>
      <div className="mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Configure your test preferences</h1>
      </div>
      
      <div className="space-y-8">
        <div className="text-left transform transition-all duration-500 hover:scale-105">
          <Label htmlFor="totalQuestions" className="text-gray-900 text-lg block mb-3">How many questions would you like?</Label>
          <Select value={formData.totalQuestions.toString()} onValueChange={(value) => handleInputChange('totalQuestions', parseInt(value))}>
            <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 text-lg h-14 rounded-lg focus:border-blue-500 transition-all duration-300 hover:scale-105">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300 animate-scale-in">
              <SelectItem value="10" className="text-gray-900 hover:bg-gray-100 transition-colors">10 questions</SelectItem>
              <SelectItem value="15" className="text-gray-900 hover:bg-gray-100 transition-colors">15 questions</SelectItem>
              <SelectItem value="20" className="text-gray-900 hover:bg-gray-100 transition-colors">20 questions</SelectItem>
              <SelectItem value="25" className="text-gray-900 hover:bg-gray-100 transition-colors">25 questions</SelectItem>
              <SelectItem value="30" className="text-gray-900 hover:bg-gray-100 transition-colors">30 questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-left transform transition-all duration-500 hover:scale-105" style={{ animationDelay: '200ms' }}>
          <Label htmlFor="codingQuestions" className="text-gray-900 text-lg block mb-3">How many coding questions?</Label>
          <Select value={formData.codingQuestions.toString()} onValueChange={(value) => handleInputChange('codingQuestions', parseInt(value))}>
            <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 text-lg h-14 rounded-lg focus:border-blue-500 transition-all duration-300 hover:scale-105">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300 animate-scale-in">
              <SelectItem value="0" className="text-gray-900 hover:bg-gray-100 transition-colors">0 coding questions</SelectItem>
              <SelectItem value="1" className="text-gray-900 hover:bg-gray-100 transition-colors">1 coding question</SelectItem>
              <SelectItem value="2" className="text-gray-900 hover:bg-gray-100 transition-colors">2 coding questions</SelectItem>
              <SelectItem value="3" className="text-gray-900 hover:bg-gray-100 transition-colors">3 coding questions</SelectItem>
              <SelectItem value="5" className="text-gray-900 hover:bg-gray-100 transition-colors">5 coding questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-left transform transition-all duration-500 hover:scale-105" style={{ animationDelay: '400ms' }}>
          <Label htmlFor="timeFrame" className="text-gray-900 text-lg block mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Calculated time required
          </Label>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-gray-900 text-lg">
            <div className="flex items-center justify-between">
              <span>Total Duration:</span>
              <span className="text-blue-600 font-bold text-xl">{formData.timeFrame} minutes</span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Based on {formData.totalQuestions - formData.codingQuestions} MCQs and {formData.codingQuestions} coding questions
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className={`max-w-2xl mx-auto text-center space-y-8 transition-all duration-500 ease-in-out ${
      isTransitioning ? 'opacity-0 transform translate-x-8' : 'opacity-100 transform translate-x-0'
    }`}>
      <div className="mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">When would you like to take the test?</h1>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-6">
          <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            !formData.scheduleForLater ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
          }`}
               onClick={() => handleInputChange('scheduleForLater', false)}>
            <input
              type="radio"
              id="startNow"
              name="schedule"
              checked={!formData.scheduleForLater}
              onChange={() => handleInputChange('scheduleForLater', false)}
              className="text-blue-500 w-5 h-5 transition-all duration-300"
            />
            <Label htmlFor="startNow" className="text-gray-900 text-lg cursor-pointer">Start the test now</Label>
          </div>
          
          <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            formData.scheduleForLater ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
          }`}
               onClick={() => handleInputChange('scheduleForLater', true)}>
            <input
              type="radio"
              id="scheduleLater"
              name="schedule"
              checked={formData.scheduleForLater}
              onChange={() => handleInputChange('scheduleForLater', true)}
              className="text-blue-500 w-5 h-5 transition-all duration-300"
            />
            <Label htmlFor="scheduleLater" className="text-gray-900 text-lg cursor-pointer">Schedule for later</Label>
          </div>
        </div>
        
        {formData.scheduleForLater && (
          <div className="text-left animate-fade-in">
            <Label htmlFor="scheduledDate" className="text-gray-900 text-lg block mb-3">Select date & time</Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
              className="bg-white border-2 border-gray-300 text-gray-900 text-lg h-14 rounded-lg focus:border-blue-500 transition-all duration-300 focus:scale-105"
            />
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-fade-in transform transition-all duration-500 hover:scale-105">
          <h4 className="text-gray-900 font-semibold mb-4 text-xl flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Test Summary
          </h4>
          <div className="text-gray-700 space-y-2">
            <p className="flex justify-between"><span>Total questions:</span> <span className="text-blue-600">{formData.totalQuestions}</span></p>
            <p className="flex justify-between"><span>Coding questions:</span> <span className="text-blue-600">{formData.codingQuestions}</span></p>
            <p className="flex justify-between"><span>Duration:</span> <span className="text-blue-600 font-bold">{formData.timeFrame} minutes</span></p>
            <p className="flex justify-between"><span>Schedule:</span> <span className="text-blue-600">{formData.scheduleForLater ? 'Later' : 'Now'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Journey
          </Button>
        </div>

        <div className="min-h-[80vh] flex flex-col justify-center">
          <div className="text-center mb-12">
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-3 rounded-full transition-all duration-500 transform ${
                    step === currentStep
                      ? 'bg-blue-500 w-8 scale-110'
                      : step < currentStep
                      ? 'bg-blue-400 w-3 scale-100'
                      : 'bg-gray-300 w-3 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mb-12">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          <div className="flex justify-center">
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                disabled={
                  (currentStep === 1 && (!formData.fullName || !formData.email || !formData.phoneNumber)) ||
                  (currentStep === 2 && (!formData.skills || !formData.experience))
                }
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleStartTest}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
              >
                {formData.scheduleForLater ? 'Schedule Test' : 'Start Test'}
              </Button>
            )}
          </div>
          
          {currentStep > 1 && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handlePrevious}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentFlow;
