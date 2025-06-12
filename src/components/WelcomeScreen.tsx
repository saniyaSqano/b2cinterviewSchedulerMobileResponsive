
import React, { useState } from 'react';
import { ArrowRight, Target, Award, Rocket, Brain, TrendingUp, Code, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '../contexts/UserContext';
import { useAiProctoUser } from '@/hooks/useAiProctoUser';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  phone: string;
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
        navigate('/levels');
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
      navigate('/levels');
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
        navigate('/levels');
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

export default WelcomeScreen;
