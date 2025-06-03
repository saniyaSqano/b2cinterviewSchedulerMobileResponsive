
import React, { useState, useEffect } from 'react';
import { useAiProctoUser } from '../hooks/useAiProctoUser';
import { ChevronLeft, ChevronRight, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { v4 as uuidv4 } from 'uuid';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import ParticleBackground from './ParticleBackground';
import MCQTest from './MCQTest';
import TestReport from './TestReport';

interface AssessmentFlowProps {
  onBack: () => void;
  onTestPassed?: () => void;
}

interface FormData {
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

  const handleNext = () => {
    if (currentStep < 2) {
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
      // Get user data from localStorage if available
      const userData = localStorage.getItem('currentUserData');
      let userInfo = null;
      
      if (userData) {
        userInfo = JSON.parse(userData);
      }
      
      setSaveStatus('Test starting...');
      
      // Show success feedback for 1.5 seconds before starting the test
      setTimeout(() => {
        setIsTransitioning(false);
        setShowTest(true);
      }, 1500);
    } catch (err) {
      console.error('Error starting test:', err);
      setSaveStatus(`Error starting test: ${err.message || 'Unknown error'}`);
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
          fullName: 'Test User',
          email: 'test@example.com',
          phoneNumber: '',
          skills: '',
          experience: ''
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

  const renderStep2 = () => (
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
              {[1, 2].map((step) => (
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
          </div>

          <div className="flex justify-center">
            {currentStep < 2 ? (
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
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
