
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
    alert('Test started! (This would redirect to the actual test interface)');
  };

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Help us personalize your experience</h1>
      </div>
      
      <div className="space-y-8">
        <div className="text-left">
          <Label htmlFor="fullName" className="text-white text-lg block mb-3">What's your name?</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="bg-transparent border-2 border-slate-600 text-white text-lg h-14 rounded-lg focus:border-purple-500"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="text-left">
          <Label htmlFor="email" className="text-white text-lg block mb-3">What's your email?</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-transparent border-2 border-slate-600 text-white text-lg h-14 rounded-lg focus:border-purple-500"
            placeholder="Enter your email address"
          />
        </div>
        
        <div className="text-left">
          <Label htmlFor="phoneNumber" className="text-white text-lg block mb-3">What's your phone number?</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="bg-transparent border-2 border-slate-600 text-white text-lg h-14 rounded-lg focus:border-purple-500"
            placeholder="Enter your phone number"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Tell us about your professional background</h1>
      </div>
      
      <div className="space-y-8">
        <div className="text-left">
          <Label htmlFor="skills" className="text-white text-lg block mb-3">What are your key skills?</Label>
          <Textarea
            id="skills"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            className="bg-transparent border-2 border-slate-600 text-white text-lg min-h-[120px] rounded-lg focus:border-purple-500"
            placeholder="List your technical skills (e.g., JavaScript, React, Python, etc.)"
          />
        </div>
        
        <div className="text-left">
          <Label htmlFor="experience" className="text-white text-lg block mb-3">Tell us about your experience</Label>
          <Textarea
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="bg-transparent border-2 border-slate-600 text-white text-lg min-h-[120px] rounded-lg focus:border-purple-500"
            placeholder="Describe your work experience and projects"
          />
        </div>
        
        <div className="text-left">
          <Label htmlFor="cv" className="text-white text-lg block mb-3">Upload your CV</Label>
          <div className="relative">
            <Input
              id="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="bg-transparent border-2 border-slate-600 text-white text-lg h-14 rounded-lg focus:border-purple-500 file:text-white file:bg-purple-600 file:border-0 file:rounded file:px-4 file:py-2 file:mr-4"
            />
            <Upload className="absolute right-4 top-4 w-6 h-6 text-slate-400" />
          </div>
          {formData.cv && (
            <p className="text-green-400 mt-2 text-sm">File uploaded: {formData.cv.name}</p>
          )}
        </div>
        
        <div className="text-left">
          <Label htmlFor="jobDescription" className="text-white text-lg block mb-3">Job description (optional)</Label>
          <Textarea
            id="jobDescription"
            value={formData.jobDescription}
            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
            className="bg-transparent border-2 border-slate-600 text-white text-lg min-h-[120px] rounded-lg focus:border-purple-500"
            placeholder="Paste the job description you're applying for"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Configure your test preferences</h1>
      </div>
      
      <div className="space-y-8">
        <div className="text-left">
          <Label htmlFor="totalQuestions" className="text-white text-lg block mb-3">How many questions would you like?</Label>
          <Select value={formData.totalQuestions.toString()} onValueChange={(value) => handleInputChange('totalQuestions', parseInt(value))}>
            <SelectTrigger className="bg-transparent border-2 border-slate-600 text-white text-lg h-14 rounded-lg focus:border-purple-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="10" className="text-white">10 questions</SelectItem>
              <SelectItem value="15" className="text-white">15 questions</SelectItem>
              <SelectItem value="20" className="text-white">20 questions</SelectItem>
              <SelectItem value="25" className="text-white">25 questions</SelectItem>
              <SelectItem value="30" className="text-white">30 questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-left">
          <Label htmlFor="codingQuestions" className="text-white text-lg block mb-3">How many coding questions?</Label>
          <Select value={formData.codingQuestions.toString()} onValueChange={(value) => handleInputChange('codingQuestions', parseInt(value))}>
            <SelectTrigger className="bg-transparent border-2 border-slate-600 text-white text-lg h-14 rounded-lg focus:border-purple-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="0" className="text-white">0 coding questions</SelectItem>
              <SelectItem value="1" className="text-white">1 coding question</SelectItem>
              <SelectItem value="2" className="text-white">2 coding questions</SelectItem>
              <SelectItem value="3" className="text-white">3 coding questions</SelectItem>
              <SelectItem value="5" className="text-white">5 coding questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-left">
          <Label htmlFor="timeFrame" className="text-white text-lg block mb-3">How much time do you need?</Label>
          <Select value={formData.timeFrame.toString()} onValueChange={(value) => handleInputChange('timeFrame', parseInt(value))}>
            <SelectTrigger className="bg-transparent border-2 border-slate-600 text-white text-lg h-14 rounded-lg focus:border-purple-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="30" className="text-white">30 minutes</SelectItem>
              <SelectItem value="45" className="text-white">45 minutes</SelectItem>
              <SelectItem value="60" className="text-white">60 minutes</SelectItem>
              <SelectItem value="90" className="text-white">90 minutes</SelectItem>
              <SelectItem value="120" className="text-white">120 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">When would you like to take the test?</h1>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 border-2 border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
               onClick={() => handleInputChange('scheduleForLater', false)}>
            <input
              type="radio"
              id="startNow"
              name="schedule"
              checked={!formData.scheduleForLater}
              onChange={() => handleInputChange('scheduleForLater', false)}
              className="text-purple-500 w-5 h-5"
            />
            <Label htmlFor="startNow" className="text-white text-lg cursor-pointer">Start the test now</Label>
          </div>
          
          <div className="flex items-center space-x-4 p-4 border-2 border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
               onClick={() => handleInputChange('scheduleForLater', true)}>
            <input
              type="radio"
              id="scheduleLater"
              name="schedule"
              checked={formData.scheduleForLater}
              onChange={() => handleInputChange('scheduleForLater', true)}
              className="text-purple-500 w-5 h-5"
            />
            <Label htmlFor="scheduleLater" className="text-white text-lg cursor-pointer">Schedule for later</Label>
          </div>
        </div>
        
        {formData.scheduleForLater && (
          <div className="text-left">
            <Label htmlFor="scheduledDate" className="text-white text-lg block mb-3">Select date & time</Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
              className="bg-transparent border-2 border-slate-600 text-white text-lg h-14 rounded-lg focus:border-purple-500"
            />
          </div>
        )}

        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
          <h4 className="text-white font-semibold mb-4 text-xl">Test Summary</h4>
          <div className="text-slate-300 space-y-2">
            <p className="flex justify-between"><span>Total questions:</span> <span>{formData.totalQuestions}</span></p>
            <p className="flex justify-between"><span>Coding questions:</span> <span>{formData.codingQuestions}</span></p>
            <p className="flex justify-between"><span>Duration:</span> <span>{formData.timeFrame} minutes</span></p>
            <p className="flex justify-between"><span>Schedule:</span> <span>{formData.scheduleForLater ? 'Later' : 'Now'}</span></p>
          </div>
        </div>
      </div>
    </div>
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

        <div className="min-h-[80vh] flex flex-col justify-center">
          <div className="text-center mb-12">
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === currentStep
                      ? 'bg-purple-500 w-8'
                      : step < currentStep
                      ? 'bg-purple-400'
                      : 'bg-slate-600'
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
                className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-3 text-lg rounded-full"
                disabled={
                  (currentStep === 1 && (!formData.fullName || !formData.email || !formData.phoneNumber)) ||
                  (currentStep === 2 && (!formData.skills || !formData.experience))
                }
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleStartTest}
                className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-3 text-lg rounded-full"
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
                className="text-slate-400 hover:text-white"
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
