
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Upload } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  skills: string;
  experience: string;
  cv: File | null;
  jobDescription: string;
}

const UserInfoForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    cv: null,
    jobDescription: ''
  });

  const totalSteps = 2;

  const updateFormData = (field: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateFormData('cv', file);
  };

  const canProceedStep1 = formData.name && formData.email && formData.phone;
  const canProceedStep2 = formData.skills && formData.experience;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle form submission
      console.log('Form submitted:', formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index + 1 === currentStep
                    ? 'bg-blue-500'
                    : index + 1 < currentStep
                    ? 'bg-blue-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Help us personalize your experience
                </h1>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg font-medium text-gray-700 mb-3 block">
                    What's your name?
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-lg font-medium text-gray-700 mb-3 block">
                    What's your email?
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-lg font-medium text-gray-700 mb-3 block">
                    What's your phone number?
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Tell us about your professional background
                </h1>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="skills" className="text-lg font-medium text-gray-700 mb-3 block">
                    What are your key skills?
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="List your technical skills (e.g., JavaScript, React, Python, etc.)"
                    value={formData.skills}
                    onChange={(e) => updateFormData('skills', e.target.value)}
                    className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="experience" className="text-lg font-medium text-gray-700 mb-3 block">
                    Tell us about your experience
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your work experience and projects"
                    value={formData.experience}
                    onChange={(e) => updateFormData('experience', e.target.value)}
                    className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="cv" className="text-lg font-medium text-gray-700 mb-3 block">
                    Upload your CV
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          onClick={() => document.getElementById('cv-upload')?.click()}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                        >
                          Choose file
                        </Button>
                        <span className="text-gray-500">
                          {formData.cv ? formData.cv.name : 'No file chosen'}
                        </span>
                      </div>
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="jobDescription" className="text-lg font-medium text-gray-700 mb-3 block">
                    Job description (optional)
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description you're applying for"
                    value={formData.jobDescription}
                    onChange={(e) => updateFormData('jobDescription', e.target.value)}
                    className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-12">
            <div>
              {currentStep > 1 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="px-8 py-3 text-lg border-2 border-gray-300 hover:border-gray-400 rounded-xl"
                >
                  Back
                </Button>
              )}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !canProceedStep1) ||
                (currentStep === 2 && !canProceedStep2)
              }
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-8 py-3 text-lg rounded-full flex items-center space-x-2 min-w-[140px] justify-center"
            >
              <span>{currentStep === totalSteps ? 'Complete' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
