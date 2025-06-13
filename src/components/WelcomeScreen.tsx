
import React, { useState } from 'react';
import { ArrowRight, Target, Award, Rocket, Brain, TrendingUp, Code, Upload, Sparkles, Star, CheckCircle, User, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '../contexts/UserContext';
import { useAiProctoUser } from '@/hooks/useAiProctoUser';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface FormData {
  technical_skills: string;
  experience: string;
  cv: File | null;
  target_job_description: string;
}

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { createUser, fetchUser, loading } = useAiProctoUser();
  const [formData, setFormData] = useState<FormData>({
    technical_skills: '',
    experience: '',
    cv: null,
    target_job_description: ''
  });

  const updateFormData = (field: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateFormData('cv', file);
  };

  const handleStartFreeAssessment = () => {
    // Set minimal user data for the assessment
    setUser({
      name: 'Guest User',
      email: 'guest@proctoverse.ai',
      phone: '',
      skills: formData.technical_skills || 'General Software Development',
      experience: formData.experience || 'Exploring career opportunities',
      jobDescription: formData.target_job_description || 'Software Developer Position',
      experienceLevel: 3,
      confidenceLevel: 5
    });
    
    toast.success('Starting your free assessment! 🚀');
    navigate('/freeassessment');
  };

  const handleSubmit = async () => {
    if (formData.target_job_description.trim().length === 0) {
      toast.error('Please provide a target job description to create your profile.');
      return;
    }

    try {
      // Create the procto user record with the form data
      const proctoUserData = {
        technical_skills: formData.technical_skills,
        experience: formData.experience,
        target_job_description: formData.target_job_description,
        cv_file_name: formData.cv?.name || null,
        // TODO: Upload CV file to storage and get URL
        cv_file_url: null
      };

      await createUser(proctoUserData);
      
      // Set user in context for the assessment
      setUser({
        name: 'User',
        email: 'user@proctoverse.ai',
        phone: '',
        skills: formData.technical_skills,
        experience: formData.experience,
        jobDescription: formData.target_job_description,
        experienceLevel: 3,
        confidenceLevel: 5
      });
      
      toast.success('Profile created! Starting your assessment! 🚀');
      navigate('/freeassessment');
    } catch (error: any) {
      toast.error('Failed to create profile. Please try again.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Solid Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ProctoVerse
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-2 border border-gray-200">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Guest User</span>
              </div>
              
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              
              <Button variant="outline" size="sm" className="sm:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Left Side - Enhanced ProctoVerse Information */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden flex items-center justify-center p-6">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-white/10 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
            
            {/* Floating elements */}
            <div className="absolute top-16 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
              <Target className="w-6 h-6 text-white/40" />
            </div>
            <div className="absolute bottom-1/4 left-1/5 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
              <Award className="w-5 h-5 text-white/40" />
            </div>
            <div className="absolute top-1/3 right-1/6 animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
              <Rocket className="w-6 h-6 text-white/40" />
            </div>
          </div>

          <div className="relative z-10 text-white max-w-xl -mt-16">
            {/* Main Title */}
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                  ProctoVerse
                </span>
              </h1>
              
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/30 shadow-lg mb-4">
                <Brain className="w-3 h-3 mr-2 text-cyan-200" />
                AI-Powered Career Platform
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-center">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-cyan-200 via-white to-cyan-200 bg-clip-text text-transparent">
                Tech Career
              </span>
            </h2>
            
            <p className="text-base text-white/90 leading-relaxed mb-6 text-center">
              AI-powered interview preparation with personalized learning paths and industry assessments.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">AI Matching</h3>
                  <p className="text-xs text-white/80">Smart recommendations</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Real-time Feedback</h3>
                  <p className="text-xs text-white/80">Instant insights</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Career Growth</h3>
                  <p className="text-xs text-white/80">Expert connections</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Skill Enhancement</h3>
                  <p className="text-xs text-white/80">Learning paths</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-1 text-cyan-200" />
                  10K+
                </div>
                <div className="text-white/80 text-xs">Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-300" />
                  95%
                </div>
                <div className="text-white/80 text-xs">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1 flex items-center justify-center">
                  <Award className="w-4 h-4 mr-1 text-yellow-300" />
                  500+
                </div>
                <div className="text-white/80 text-xs">Companies</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started Today</h2>
              <p className="text-gray-600">Begin your career journey</p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/70 p-6">
              {/* Quick Start Section */}
              <div className="text-center mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">🚀 Try Our Free Assessment</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Skip the form and jump straight into our AI-powered assessment to test your skills
                </p>
                <Button
                  onClick={handleStartFreeAssessment}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-base rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Free Assessment Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-4 text-gray-500 text-sm font-medium">OR</div>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Form Section */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Personalize Your Experience</h3>
                <p className="text-gray-600 text-sm">
                  Fill out your details for a customized learning path
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="skills" className="text-sm font-bold text-gray-700 mb-2 block flex items-center">
                    <Code className="w-4 h-4 mr-2 text-blue-600" />
                    Technical Skills (Optional)
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="e.g., React, Node.js, Python, AWS..."
                    value={formData.technical_skills}
                    onChange={(e) => updateFormData('technical_skills', e.target.value)}
                    className="min-h-[80px] bg-white border-2 border-gray-200 focus:border-blue-500 rounded-lg resize-none text-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="experience" className="text-sm font-bold text-gray-700 mb-2 block flex items-center">
                    <Award className="w-4 h-4 mr-2 text-purple-600" />
                    Experience & Achievements (Optional)
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your work experience and projects..."
                    value={formData.experience}
                    onChange={(e) => updateFormData('experience', e.target.value)}
                    className="min-h-[80px] bg-white border-2 border-gray-200 focus:border-purple-500 rounded-lg resize-none text-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="jobDescription" className="text-sm font-bold text-gray-700 mb-2 block flex items-center">
                    <Target className="w-4 h-4 mr-2 text-green-600" />
                    Target Job Description *
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description or describe your target role..."
                    value={formData.target_job_description}
                    onChange={(e) => updateFormData('target_job_description', e.target.value)}
                    className="min-h-[100px] bg-white border-2 border-gray-200 focus:border-green-500 rounded-lg resize-none text-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="cv" className="text-sm font-bold text-gray-700 mb-2 block flex items-center">
                    <Upload className="w-4 h-4 mr-2 text-indigo-600" />
                    Upload CV/Resume (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-all duration-300 bg-gradient-to-r from-indigo-50/50 to-blue-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          onClick={() => document.getElementById('cv-upload')?.click()}
                          variant="outline"
                          size="sm"
                          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        >
                          Choose File
                        </Button>
                        <span className="text-gray-600 text-sm truncate max-w-32">
                          {formData.cv ? formData.cv.name : 'No file chosen'}
                        </span>
                      </div>
                      <Upload className="w-4 h-4 text-gray-400" />
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

                <Button
                  onClick={handleSubmit}
                  disabled={formData.target_job_description.trim().length === 0 || loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white py-3 text-base rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                      Setting up...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Rocket className="w-4 h-4 mr-2" />
                      Create Profile & Start Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-1">
                  <p className="text-sm text-gray-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                    No signup required • Instant results
                  </p>
                  <p className="text-xs text-gray-400">
                    Join thousands advancing their careers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
