
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Proctoverse Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 animate-fade-in">
            Proctoverse
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index + 1 === currentStep
                    ? 'bg-gradient-to-r from-purple-400 to-blue-400 shadow-lg shadow-purple-500/50'
                    : index + 1 < currentStep
                    ? 'bg-gradient-to-r from-purple-300 to-blue-300'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-12">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Help us personalize your experience
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg font-medium text-white/90 mb-3 block">
                    What's your name?
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="h-14 text-lg bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-lg font-medium text-white/90 mb-3 block">
                    What's your email?
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="h-14 text-lg bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-lg font-medium text-white/90 mb-3 block">
                    What's your phone number?
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="h-14 text-lg bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Tell us about your professional background
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="skills" className="text-lg font-medium text-white/90 mb-3 block">
                    What are your key skills?
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="List your technical skills (e.g., JavaScript, React, Python, etc.)"
                    value={formData.skills}
                    onChange={(e) => updateFormData('skills', e.target.value)}
                    className="min-h-[120px] text-lg bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-xl resize-none text-white placeholder:text-white/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="experience" className="text-lg font-medium text-white/90 mb-3 block">
                    Tell us about your experience
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your work experience and projects"
                    value={formData.experience}
                    onChange={(e) => updateFormData('experience', e.target.value)}
                    className="min-h-[120px] text-lg bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-xl resize-none text-white placeholder:text-white/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="cv" className="text-lg font-medium text-white/90 mb-3 block">
                    Upload your CV
                  </Label>
                  <div className="border-2 border-dashed border-white/30 rounded-xl p-6 hover:border-purple-400 transition-colors bg-white/5 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          onClick={() => document.getElementById('cv-upload')?.click()}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg shadow-lg"
                        >
                          Choose file
                        </Button>
                        <span className="text-white/70">
                          {formData.cv ? formData.cv.name : 'No file chosen'}
                        </span>
                      </div>
                      <Upload className="w-6 h-6 text-white/50" />
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
                  <Label htmlFor="jobDescription" className="text-lg font-medium text-white/90 mb-3 block">
                    Job description (optional)
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description you're applying for"
                    value={formData.jobDescription}
                    onChange={(e) => updateFormData('jobDescription', e.target.value)}
                    className="min-h-[120px] text-lg bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-xl resize-none text-white placeholder:text-white/50 backdrop-blur-sm"
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
                  className="px-8 py-3 text-lg border-2 border-white/30 hover:border-white/50 rounded-xl bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
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
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-8 py-3 text-lg rounded-full flex items-center space-x-2 min-w-[140px] justify-center shadow-lg shadow-purple-500/25"
            >
              <span>{currentStep === totalSteps ? 'Complete' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-20px) translateX(-5px); }
          75% { transform: translateY(-10px) translateX(10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default UserInfoForm;
