import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Upload, Sparkles, Users, Brain, Target, Award, Zap, Star, Rocket, Code, Globe } from 'lucide-react';
import { useAiProctoUser } from '@/hooks/useAiProctoUser';
import { toast } from 'sonner';

interface FormData {
  name: string;
  email: string;
  phone: string;
  skills: string;
  experience: string;
  cv: File | null;
  jobDescription: string;
  experienceLevel: number[];
  confidenceLevel: number[];
}

const UserInfoForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { createUser, loading } = useAiProctoUser();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    cv: null,
    jobDescription: '',
    experienceLevel: [3],
    confidenceLevel: [5]
  });

  const totalSteps = 3;

  const updateFormData = (field: keyof FormData, value: string | File | null | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateFormData('cv', file);
  };

  const canProceedStep1 = formData.name && formData.email && formData.phone;
  const canProceedStep2 = formData.skills && formData.experience;
  const canProceedStep3 = formData.experienceLevel && formData.confidenceLevel;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle form submission and redirect to levels page
      try {
        await createUser({
          email: formData.email,
          full_name: formData.name,
          phone_number: formData.phone,
          skills: formData.skills,
          cv_file_name: formData.cv?.name,
          job_description: formData.jobDescription,
          policies_accepted: true
        });
        
        toast.success('Profile created successfully! Welcome to ProctoVerse! 🚀');
        navigate('/levels');
      } catch (error) {
        toast.error('Failed to create profile. Please try again.');
        console.error('Form submission error:', error);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden flex items-center justify-center p-6">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes with better animations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Moving gradient orbs */}
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-indigo-300/30 to-purple-300/30 rounded-full blur-2xl animate-bounce delay-2000" style={{ animationDuration: '6s' }}></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.4) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            animation: 'float 20s ease-in-out infinite'
          }}></div>
        </div>
        
        {/* Enhanced floating icons with motion */}
        <div className="absolute top-16 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <Target className="w-10 h-10 text-blue-400/50" />
        </div>
        <div className="absolute bottom-1/4 left-1/5 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
          <Award className="w-8 h-8 text-indigo-400/50" />
        </div>
        <div className="absolute top-1/3 right-1/6 animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
          <Rocket className="w-9 h-9 text-cyan-400/50" />
        </div>
        <div className="absolute top-3/4 left-1/3 animate-bounce" style={{ animationDelay: '4s', animationDuration: '4.5s' }}>
          <Code className="w-7 h-7 text-purple-400/50" />
        </div>
        <div className="absolute bottom-1/2 right-1/5 animate-bounce" style={{ animationDelay: '5s', animationDuration: '6s' }}>
          <Globe className="w-8 h-8 text-blue-500/50" />
        </div>
        
        {/* Enhanced floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 8}s`
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-3xl relative z-10">
        {/* Enhanced ProctoVerse Header */}
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-6 tracking-tight">
            ProctoVerse
          </h1>
          <div className="w-40 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 mx-auto rounded-full animate-pulse mb-8"></div>
          
          {/* Enhanced taglines with animations */}
          <div className="space-y-3 mb-8">
            <p className="text-xl font-semibold text-gray-700">
              🚀 Master Your Interview Skills with AI-Powered Training
            </p>
            <p className="text-lg text-gray-600">
              ✨ Real-time Feedback • Smart Proctoring • Personalized Learning Paths
            </p>
            <p className="text-md text-gray-500">
              🎯 Practice → Analyze → Improve → Succeed
            </p>
          </div>
          
          {/* Enhanced feature highlights */}
          <div className="flex justify-center flex-wrap gap-6 mb-8">
            <div className="flex items-center space-x-2 text-gray-600 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
              <Brain className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">AI-Powered Mentor</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">Live Mock Interviews</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <span className="text-sm font-medium">Performance Analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
              <Star className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Skill Assessment</span>
            </div>
          </div>
        </div>

        {/* Enhanced Progress indicators */}
        <div className="flex justify-center mb-10">
          <div className="flex space-x-3">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    index + 1 === currentStep
                      ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-125'
                      : index + 1 < currentStep
                      ? 'bg-blue-400'
                      : 'bg-gray-300'
                  }`}
                />
                <span className="text-xs text-gray-500 mt-2">
                  {index === 0 ? 'Basic Info' : index === 1 ? 'Experience' : 'Skills Assessment'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/70 p-10 md:p-12 hover:shadow-3xl transition-all duration-300">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Welcome to Your Journey! 🌟
                </h2>
                <p className="text-gray-600 text-lg">Let's start with some basic information to personalize your experience</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold text-gray-700 mb-3 block">
                    What's your name? ✨
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="h-14 text-lg bg-white/90 border-2 border-gray-200 focus:border-blue-400 rounded-xl text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-lg font-semibold text-gray-700 mb-3 block">
                    What's your email address? 📧
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="h-14 text-lg bg-white/90 border-2 border-gray-200 focus:border-blue-400 rounded-xl text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-lg font-semibold text-gray-700 mb-3 block">
                    What's your phone number? 📱
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="h-14 text-lg bg-white/90 border-2 border-gray-200 focus:border-blue-400 rounded-xl text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Share Your Expertise 💼
                </h2>
                <p className="text-gray-600 text-lg">Help us understand your professional background and goals</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="skills" className="text-lg font-semibold text-gray-700 mb-3 block">
                    What are your key skills? 🎯
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="List your technical skills (e.g., JavaScript, React, Python, Machine Learning, etc.)"
                    value={formData.skills}
                    onChange={(e) => updateFormData('skills', e.target.value)}
                    className="min-h-[120px] text-lg bg-white/90 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="experience" className="text-lg font-semibold text-gray-700 mb-3 block">
                    Tell us about your experience 💡
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your work experience, projects, and achievements"
                    value={formData.experience}
                    onChange={(e) => updateFormData('experience', e.target.value)}
                    className="min-h-[120px] text-lg bg-white/90 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="cv" className="text-lg font-semibold text-gray-700 mb-3 block">
                    Upload your CV/Resume 📄
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          onClick={() => document.getElementById('cv-upload')?.click()}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          Choose file
                        </Button>
                        <span className="text-gray-600 font-medium">
                          {formData.cv ? formData.cv.name : 'No file chosen'}
                        </span>
                      </div>
                      <Upload className="w-8 h-8 text-gray-400" />
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
                  <Label htmlFor="jobDescription" className="text-lg font-semibold text-gray-700 mb-3 block">
                    Target job description (optional) 🎯
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description you're targeting for better preparation"
                    value={formData.jobDescription}
                    onChange={(e) => updateFormData('jobDescription', e.target.value)}
                    className="min-h-[120px] text-lg bg-white/90 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none text-gray-800 placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Almost Ready! 🚀
                </h2>
                <p className="text-gray-600 text-lg">Let's assess your current skill level to personalize your training</p>
              </div>

              <div className="space-y-8">
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-4 block">
                    Years of Experience 📈
                  </Label>
                  <div className="px-4 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <Slider
                      value={formData.experienceLevel}
                      onValueChange={(value) => updateFormData('experienceLevel', value)}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>0 years</span>
                      <span className="font-semibold text-blue-600">{formData.experienceLevel[0]} years</span>
                      <span>10+ years</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-4 block">
                    Interview Confidence Level 💪
                  </Label>
                  <div className="px-4 py-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                    <Slider
                      value={formData.confidenceLevel}
                      onValueChange={(value) => updateFormData('confidenceLevel', value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Beginner</span>
                      <span className="font-semibold text-cyan-600">
                        Level {formData.confidenceLevel[0]}/10
                      </span>
                      <span>Expert</span>
                    </div>
                  </div>
                </div>

                <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Begin Your Journey? 🎉</h3>
                  <p className="text-gray-600">We'll create a personalized learning path based on your profile</p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Navigation buttons */}
          <div className="flex justify-between items-center mt-12">
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
                (currentStep === 2 && !canProceedStep2) ||
                (currentStep === 3 && !canProceedStep3) ||
                loading
              }
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 text-lg rounded-full flex items-center space-x-2 min-w-[160px] justify-center shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
            >
              <span>
                {loading ? 'Creating...' : currentStep === totalSteps ? 'Start Journey' : 'Continue'}
              </span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Enhanced bottom tagline */}
        <div className="text-center mt-10">
          <p className="text-gray-600 text-lg mb-2">
            🌟 Join thousands of successful professionals who've mastered their interviews
          </p>
          <p className="text-gray-500 text-sm">
            Trusted by top companies • 95% success rate • AI-powered insights
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
