import React, { useState } from 'react';
import { ArrowLeft, Trophy, Star, Award, Brain, Users, Sparkles, Target, Rocket, Code, Globe, CheckCircle, Clock, TrendingUp, ArrowRight, Play, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ParticleBackground from '../components/ParticleBackground';
import AssessmentFlow from '../components/AssessmentFlow';
import ChatFlow from '../components/ChatFlow';
import Level3Flow from '../components/Level3Flow';
import Level4Flow from '../components/Level4Flow';
import GamethonFlow from '../components/GamethonFlow';
import InteractiveRoadmap from '../components/InteractiveRoadmap';
import { useUser } from '../contexts/UserContext';
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
}

const Index = () => {
  const { user } = useUser();
  
  // If user exists, show the levels content, otherwise show welcome screen
  if (user) {
    return <LevelsContent />;
  }
  
  return <WelcomeScreen />;
};

const WelcomeScreen = () => {
  const { setUser } = useUser();
  const { createUser, fetchUser, loading } = useAiProctoUser();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
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

  const canSubmit = formData.email && formData.jobDescription;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      // First try to fetch existing user
      const existingUser = await fetchUser(formData.email);
      
      if (existingUser) {
        // User already exists, just set them in context and proceed
        setUser({
          name: formData.name || 'User',
          email: formData.email,
          phone: formData.phone,
          skills: formData.skills,
          experience: formData.experience,
          jobDescription: formData.jobDescription,
          experienceLevel: 3,
          confidenceLevel: 5
        });
        
        toast.success('Welcome back! Starting your assessment! 🚀');
        return;
      }

      // User doesn't exist, create new user
      await createUser({
        email: formData.email,
        full_name: formData.name || 'User',
        phone_number: formData.phone,
        skills: formData.skills,
        cv_file_name: formData.cv?.name,
        job_description: formData.jobDescription,
        policies_accepted: true
      });
      
      // Set user in context
      setUser({
        name: formData.name || 'User',
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills,
        experience: formData.experience,
        jobDescription: formData.jobDescription,
        experienceLevel: 3,
        confidenceLevel: 5
      });
      
      toast.success('Profile created! Starting your assessment! 🚀');
    } catch (error: any) {
      // Handle duplicate email error specifically
      if (error?.code === '23505' || error?.message?.includes('duplicate key')) {
        // User already exists, just proceed with the form data
        setUser({
          name: formData.name || 'User',
          email: formData.email,
          phone: formData.phone,
          skills: formData.skills,
          experience: formData.experience,
          jobDescription: formData.jobDescription,
          experienceLevel: 3,
          confidenceLevel: 5
        });
        
        toast.success('Welcome back! Starting your assessment! 🚀');
      } else {
        toast.error('Failed to create profile. Please try again.');
        console.error('Form submission error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - ProctoVerse Information */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden flex items-center justify-center p-12">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-white/10 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
          
          {/* Floating icons */}
          <div className="absolute top-16 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
            <Target className="w-8 h-8 text-white/40" />
          </div>
          <div className="absolute bottom-1/4 left-1/5 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
            <Award className="w-6 h-6 text-white/40" />
          </div>
          <div className="absolute top-1/3 right-1/6 animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
            <Rocket className="w-7 h-7 text-white/40" />
          </div>
        </div>

        <div className="relative z-10 text-white max-w-2xl">
          {/* Main Title */}
          <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              ProctoVerse
            </span>
          </h1>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Accelerate Your
            <br />
            <span className="bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent">
              Tech Career
            </span>
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-12">
            Join thousands of professionals advancing with AI-powered interview preparation, 
            personalized learning paths, and industry-standard assessments.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI-Powered Matching</h3>
                <p className="text-sm text-white/80">Intelligent job recommendations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Real-time Updates</h3>
                <p className="text-sm text-white/80">Instant notifications</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Career Growth</h3>
                <p className="text-sm text-white/80">Connect with industry experts</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Tech Skills Enhancement</h3>
                <p className="text-sm text-white/80">Personalized learning paths</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10,000+</div>
              <div className="text-white/80 text-sm">Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">95%</div>
              <div className="text-white/80 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-white/80 text-sm">Companies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started Today</h2>
            <p className="text-gray-600">Tell us about yourself to begin your personalized journey</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/70 p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Full Name (Optional)
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="h-12 bg-white border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="h-12 bg-white border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="h-12 bg-white border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="skills" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Skills (Optional)
                </Label>
                <Textarea
                  id="skills"
                  placeholder="List your technical skills, programming languages, frameworks..."
                  value={formData.skills}
                  onChange={(e) => updateFormData('skills', e.target.value)}
                  className="min-h-[80px] bg-white border-2 border-gray-200 focus:border-blue-400 rounded-lg resize-none"
                />
              </div>

              <div>
                <Label htmlFor="experience" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Experience (Optional)
                </Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your work experience and achievements..."
                  value={formData.experience}
                  onChange={(e) => updateFormData('experience', e.target.value)}
                  className="min-h-[80px] bg-white border-2 border-gray-200 focus:border-blue-400 rounded-lg resize-none"
                />
              </div>

              <div>
                <Label htmlFor="jobDescription" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Job Description *
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description you're targeting..."
                  value={formData.jobDescription}
                  onChange={(e) => updateFormData('jobDescription', e.target.value)}
                  className="min-h-[100px] bg-white border-2 border-gray-200 focus:border-blue-400 rounded-lg resize-none"
                />
              </div>

              <div>
                <Label htmlFor="cv" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Upload CV/Resume (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-all duration-300 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        type="button"
                        onClick={() => document.getElementById('cv-upload')?.click()}
                        variant="outline"
                        className="px-4 py-2 text-sm"
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? 'Setting up...' : 'Start Free Assessment'}
                {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>

              <p className="text-center text-sm text-gray-500">
                🌟 No credit card required • Instant results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LevelsContent = () => {
  const { user, setUser } = useUser();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLevel3, setShowLevel3] = useState(false);
  const [showLevel4, setShowLevel4] = useState(false);
  const [showGamethon, setShowGamethon] = useState(false);
  const [assessmentScore] = useState(70);

  // Credits earned per level (updated for 5 levels)
  const levelCredits = {
    0: 100, // Skill Assessment
    1: 150, // AI Mentor Chat
    2: 200, // Pitch Builder
    3: 250, // Proctored Interview
    4: 500  // Gamethon
  };

  const getTotalCredits = () => {
    return completedLevels.reduce((total, level) => total + (levelCredits[level as keyof typeof levelCredits] || 0), 0);
  };

  const handleCardClick = (index: number) => {
    console.log(`Starting level ${index}`);
    
    if (index === 0) {
      setShowAssessment(true);
      return;
    }
    
    if (index === 1) {
      setShowChat(true);
      return;
    }

    if (index === 2) {
      setShowLevel3(true);
      return;
    }

    if (index === 3) {
      setShowLevel4(true);
      return;
    }

    if (index === 4) {
      setShowGamethon(true);
      return;
    }
    
    setTimeout(() => {
      if (!completedLevels.includes(index)) {
        setCompletedLevels(prev => [...prev, index]);
        if (index === currentLevel && currentLevel < 4) {
          setCurrentLevel(prev => prev + 1);
        }
      }
    }, 2000);
  };

  const handleTestPassed = () => {
    if (!completedLevels.includes(0)) {
      setCompletedLevels(prev => [...prev, 0]);
      setCurrentLevel(1);
    }
  };

  const handleChatCompleted = () => {
    if (!completedLevels.includes(1)) {
      setCompletedLevels(prev => [...prev, 1]);
      setCurrentLevel(2);
    }
  };

  const handleLevel3Completed = () => {
    if (!completedLevels.includes(2)) {
      setCompletedLevels(prev => [...prev, 2]);
      setCurrentLevel(3);
    }
  };

  const handleLevel4Completed = () => {
    if (!completedLevels.includes(3)) {
      setCompletedLevels(prev => [...prev, 3]);
      setCurrentLevel(4);
    }
  };

  const handleGamethonCompleted = () => {
    if (!completedLevels.includes(4)) {
      setCompletedLevels(prev => [...prev, 4]);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Get user's first name
  const getUserDisplayName = () => {
    if (!user?.name) return 'User';
    const firstName = user.name.split(' ')[0];
    return firstName;
  };

  if (showAssessment) {
    return (
      <AssessmentFlow 
        onBack={() => setShowAssessment(false)}
        onTestPassed={handleTestPassed}
      />
    );
  }

  if (showChat) {
    return (
      <ChatFlow 
        onBack={() => {
          setShowChat(false);
          handleChatCompleted();
        }}
        userName={getUserDisplayName()}
        assessmentScore={assessmentScore}
      />
    );
  }

  if (showLevel3) {
    return (
      <Level3Flow 
        onBack={() => {
          setShowLevel3(false);
          handleLevel3Completed();
        }}
        userName={getUserDisplayName()}
      />
    );
  }

  if (showLevel4) {
    return (
      <Level4Flow 
        onBack={() => {
          setShowLevel4(false);
          handleLevel4Completed();
        }}
        userName={getUserDisplayName()}
      />
    );
  }

  if (showGamethon) {
    return (
      <GamethonFlow 
        onBack={() => {
          setShowGamethon(false);
          handleGamethonCompleted();
        }}
        userName={getUserDisplayName()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Professional Background with Subtle Animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
        
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-indigo-400/40 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Enhanced Hero Section with ProctoVerse as Main Title */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
          {/* Main Application Title */}
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse-glow">
                ProctoVerse
              </span>
            </h1>
            <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 text-sm font-medium border border-gray-200/50 shadow-sm">
              <Brain className="w-4 h-4 mr-2 text-blue-600" />
              AI-Powered Professional Development
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Accelerate Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Career Growth
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Master professional skills through AI-guided training, personalized feedback, and industry-standard assessments
          </p>

          <div className="flex justify-center flex-wrap gap-8 mb-12">
            <div className="flex items-center space-x-2 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Industry Certified</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">10,000+ Professionals</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">95% Success Rate</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">24/7 AI Support</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                {completedLevels.length}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">Modules Completed</div>
              <div className="text-lg font-bold text-gray-900">{completedLevels.length} of 5</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                {Math.round((completedLevels.length / 5) * 100)}%
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">Overall Progress</div>
              <div className="text-lg font-bold text-gray-900">Course Completion</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">Credits Earned</div>
              <div className="text-lg font-bold text-gray-900">{getTotalCredits()} Points</div>
            </div>
          </div>

          {completedLevels.length > 0 && (
            <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm max-w-3xl mx-auto">
              <h3 className="text-gray-900 font-bold text-xl mb-6 flex items-center justify-center">
                <Award className="w-6 h-6 mr-2 text-blue-500" />
                Achievement Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {completedLevels.map((level) => (
                  <div key={level} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200/50">
                    <span className="text-gray-700 text-sm font-medium">Module {level + 1}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-900 font-bold">{levelCredits[level as keyof typeof levelCredits]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Learning Journey</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow our structured path to master professional skills and advance your career
            </p>
          </div>
          
          <InteractiveRoadmap
            currentLevel={currentLevel}
            completedLevels={completedLevels}
            onStepClick={handleCardClick}
            levelCredits={levelCredits}
          />
        </div>

        <div className="text-center mt-20 pb-16">
          <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900">Ready to Transform Your Career?</h3>
                <p className="text-gray-600">Join thousands of professionals who've accelerated their growth</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">Certified Training</div>
                <div className="text-sm text-gray-600">Industry-recognized certifications</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">AI-Powered Learning</div>
                <div className="text-sm text-gray-600">Personalized feedback and guidance</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">Career Growth</div>
                <div className="text-sm text-gray-600">Proven results and outcomes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
