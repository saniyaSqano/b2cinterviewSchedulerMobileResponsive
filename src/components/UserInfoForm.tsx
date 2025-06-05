
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Upload, Sparkles, Users, Brain, Target, Award, Zap } from 'lucide-react';

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
  const navigate = useNavigate();
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
      // Handle form submission and redirect to levels page
      console.log('Form submitted:', formData);
      navigate('/levels');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Floating icons */}
        <div className="absolute top-16 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
          <Target className="w-8 h-8 text-blue-400/40" />
        </div>
        <div className="absolute bottom-1/4 left-1/5 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}>
          <Award className="w-6 h-6 text-indigo-400/40" />
        </div>
        <div className="absolute top-1/3 right-1/6 animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
          <Zap className="w-7 h-7 text-purple-400/40" />
        </div>
        
        {/* Floating particles with light colors */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Proctoverse Header with taglines */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Proctoverse
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full animate-pulse mb-6"></div>
          
          {/* Dynamic taglines */}
          <div className="space-y-2 mb-6">
            <p className="text-lg text-gray-600 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              🚀 Elevate Your Career Journey
            </p>
            <p className="text-md text-gray-500 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              AI-Powered Interview Preparation • Smart Assessment • Real-time Feedback
            </p>
          </div>
          
          {/* Feature highlights */}
          <div className="flex justify-center space-x-8 mb-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center space-x-2 text-gray-600">
              <Brain className="w-5 h-5 text-blue-500" />
              <span className="text-sm">AI Mentor</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="text-sm">Mock Interviews</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Smart Analytics</span>
            </div>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index + 1 === currentStep
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-125'
                    : index + 1 < currentStep
                    ? 'bg-blue-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-12 animate-scale-in hover:shadow-3xl transition-all duration-300" style={{ animationDelay: '1s' }}>
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Help us personalize your experience
                </h2>
                <p className="text-gray-600">Let's get to know you better for a tailored journey</p>
              </div>

              <div className="space-y-6">
                <div className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
                  <Label htmlFor="name" className="text-lg font-medium text-gray-700 mb-3 block">
                    What's your name? ✨
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="h-14 text-lg bg-gray-50/80 border-2 border-gray-200 focus:border-blue-400 rounded-xl text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '1.4s' }}>
                  <Label htmlFor="email" className="text-lg font-medium text-gray-700 mb-3 block">
                    What's your email? 📧
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="h-14 text-lg bg-gray-50/80 border-2 border-gray-200 focus:border-blue-400 rounded-xl text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '1.6s' }}>
                  <Label htmlFor="phone" className="text-lg font-medium text-gray-700 mb-3 block">
                    What's your phone number? 📱
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="h-14 text-lg bg-gray-50/80 border-2 border-gray-200 focus:border-blue-400 rounded-xl text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Tell us about your professional background
                </h2>
                <p className="text-gray-600">Help us understand your expertise and goals</p>
              </div>

              <div className="space-y-6">
                <div className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
                  <Label htmlFor="skills" className="text-lg font-medium text-gray-700 mb-3 block">
                    What are your key skills? 🎯
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="List your technical skills (e.g., JavaScript, React, Python, etc.)"
                    value={formData.skills}
                    onChange={(e) => updateFormData('skills', e.target.value)}
                    className="min-h-[120px] text-lg bg-gray-50/80 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '1.4s' }}>
                  <Label htmlFor="experience" className="text-lg font-medium text-gray-700 mb-3 block">
                    Tell us about your experience 💼
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your work experience and projects"
                    value={formData.experience}
                    onChange={(e) => updateFormData('experience', e.target.value)}
                    className="min-h-[120px] text-lg bg-gray-50/80 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '1.6s' }}>
                  <Label htmlFor="cv" className="text-lg font-medium text-gray-700 mb-3 block">
                    Upload your CV 📄
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 bg-gray-50/80 backdrop-blur-sm hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          onClick={() => document.getElementById('cv-upload')?.click()}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          Choose file
                        </Button>
                        <span className="text-gray-600">
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

                <div className="animate-fade-in" style={{ animationDelay: '1.8s' }}>
                  <Label htmlFor="jobDescription" className="text-lg font-medium text-gray-700 mb-3 block">
                    Job description (optional) 🎪
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description you're applying for"
                    value={formData.jobDescription}
                    onChange={(e) => updateFormData('jobDescription', e.target.value)}
                    className="min-h-[120px] text-lg bg-gray-50/80 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-12 animate-fade-in" style={{ animationDelay: '2s' }}>
            <div>
              {currentStep > 1 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="px-8 py-3 text-lg border-2 border-gray-300 hover:border-gray-400 rounded-xl bg-white text-gray-700 hover:bg-gray-50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
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
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 text-lg rounded-full flex items-center space-x-2 min-w-[140px] justify-center shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
            >
              <span>{currentStep === totalSteps ? 'Complete' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '2.2s' }}>
          <p className="text-gray-500 text-sm">
            Trusted by professionals worldwide • Join 10k+ successful candidates
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
