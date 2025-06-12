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
  skills: string;
  experience: string;
  cv: File | null;
  jobDescription: string;
}

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { createUser, fetchUser, loading } = useAiProctoUser();
  const [formData, setFormData] = useState<FormData>({
    skills: '',
    experience: '',
    cv: null,
    jobDescription: ''
  });

  const updateFormData = (field: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateFormData('cv', file);
  };

  const canSubmit = formData.jobDescription.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      // Generate a unique email for anonymous users
      const anonymousEmail = `user_${Date.now()}@proctoverse.ai`;
      
      // Set user in context with anonymous data
      setUser({
        name: 'User',
        email: anonymousEmail,
        phone: '',
        skills: formData.skills,
        experience: formData.experience,
        jobDescription: formData.jobDescription,
        experienceLevel: 3,
        confidenceLevel: 5
      });
      
      toast.success('Profile created! Starting your assessment! 🚀');
      navigate('/levels');
    } catch (error: any) {
      toast.error('Failed to create profile. Please try again.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ProctoVerse
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
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
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Side - Enhanced ProctoVerse Information */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden flex items-center justify-center p-8 lg:p-12">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-white/10 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
            
            {/* Enhanced floating elements */}
            <div className="absolute top-16 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
              <Target className="w-8 h-8 text-white/40" />
            </div>
            <div className="absolute bottom-1/4 left-1/5 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
              <Award className="w-6 h-6 text-white/40" />
            </div>
            <div className="absolute top-1/3 right-1/6 animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
              <Rocket className="w-7 h-7 text-white/40" />
            </div>
            <div className="absolute top-2/3 left-1/4 animate-bounce" style={{ animationDelay: '4s', animationDuration: '4.5s' }}>
              <Star className="w-5 h-5 text-white/40" />
            </div>
            <div className="absolute bottom-1/3 right-1/3 animate-bounce" style={{ animationDelay: '5s', animationDuration: '6s' }}>
              <Sparkles className="w-6 h-6 text-white/40" />
            </div>
          </div>

          <div className="relative z-10 text-white max-w-2xl">
            {/* Enhanced Main Title */}
            <div className="text-center mb-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent animate-pulse">
                  ProctoVerse
                </span>
              </h1>
              
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30 shadow-lg mb-6">
                <Brain className="w-4 h-4 mr-2 text-cyan-200" />
                AI-Powered Career Acceleration Platform
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-center">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-cyan-200 via-white to-cyan-200 bg-clip-text text-transparent">
                Tech Career
              </span>
            </h2>
            
            <p className="text-lg text-white/90 leading-relaxed mb-8 text-center">
              Join thousands of professionals advancing with AI-powered interview preparation, 
              personalized learning paths, and industry-standard assessments.
            </p>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">AI-Powered Matching</h3>
                  <p className="text-sm text-white/80">Intelligent job recommendations</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Real-time Feedback</h3>
                  <p className="text-sm text-white/80">Instant performance insights</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Career Growth</h3>
                  <p className="text-sm text-white/80">Connect with industry experts</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Skill Enhancement</h3>
                  <p className="text-sm text-white/80">Personalized learning paths</p>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-2 text-cyan-200" />
                  10,000+
                </div>
                <div className="text-white/80 text-sm font-medium">Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-300" />
                  95%
                </div>
                <div className="text-white/80 text-sm font-medium">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                  <Award className="w-6 h-6 mr-2 text-yellow-300" />
                  500+
                </div>
                <div className="text-white/80 text-sm font-medium">Companies</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Started Today</h2>
              <p className="text-gray-600 text-lg">Begin your personalized career journey</p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/70 p-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="skills" className="text-sm font-bold text-gray-700 mb-3 block flex items-center">
                    <Code className="w-4 h-4 mr-2 text-blue-600" />
                    Technical Skills (Optional)
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="e.g., React, Node.js, Python, AWS, Machine Learning..."
                    value={formData.skills}
                    onChange={(e) => updateFormData('skills', e.target.value)}
                    className="min-h-[100px] bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl resize-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="experience" className="text-sm font-bold text-gray-700 mb-3 block flex items-center">
                    <Award className="w-4 h-4 mr-2 text-purple-600" />
                    Experience & Achievements (Optional)
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your work experience, projects, and key achievements..."
                    value={formData.experience}
                    onChange={(e) => updateFormData('experience', e.target.value)}
                    className="min-h-[100px] bg-white border-2 border-gray-200 focus:border-purple-500 rounded-xl resize-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="jobDescription" className="text-sm font-bold text-gray-700 mb-3 block flex items-center">
                    <Target className="w-4 h-4 mr-2 text-green-600" />
                    Target Job Description *
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description you're targeting or describe your dream role..."
                    value={formData.jobDescription}
                    onChange={(e) => updateFormData('jobDescription', e.target.value)}
                    className="min-h-[120px] bg-white border-2 border-gray-200 focus:border-green-500 rounded-xl resize-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="cv" className="text-sm font-bold text-gray-700 mb-3 block flex items-center">
                    <Upload className="w-4 h-4 mr-2 text-indigo-600" />
                    Upload CV/Resume (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-400 transition-all duration-300 bg-gradient-to-r from-indigo-50/50 to-blue-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          onClick={() => document.getElementById('cv-upload')?.click()}
                          variant="outline"
                          className="px-6 py-2 text-sm font-medium border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        >
                          Choose File
                        </Button>
                        <span className="text-gray-600 text-sm">
                          {formData.cv ? formData.cv.name : 'No file chosen'}
                        </span>
                      </div>
                      <Upload className="w-5 h-5 text-gray-400" />
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
                  disabled={!canSubmit || loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white py-4 text-lg rounded-xl font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:hover:scale-100 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Setting up...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Rocket className="w-5 h-5 mr-2" />
                      Start Free Assessment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                    No signup required • Instant results
                  </p>
                  <p className="text-xs text-gray-400">
                    Join thousands of professionals advancing their careers
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
