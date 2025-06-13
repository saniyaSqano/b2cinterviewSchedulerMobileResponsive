
import React, { useState } from 'react';
import { ArrowRight, Play, CheckCircle, Shield, Eye, Lock, Mic, BarChart3, Users, GraduationCap, Building2, ChevronLeft, ChevronRight, Star, Globe, Mail, Twitter, Linkedin, Facebook, Brain, Camera, Clock, FileText, Award, Zap, AlertTriangle, UserX, Smartphone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const features = [
    {
      icon: Eye,
      title: "Advanced Eye Tracking",
      description: "AI monitors eye movement patterns to detect suspicious behavior during exams and interviews"
    },
    {
      icon: Camera,
      title: "Facial Recognition",
      description: "Verify candidate identity and detect multiple people in frame to prevent impersonation"
    },
    {
      icon: Mic,
      title: "Audio Intelligence",
      description: "Real-time voice analysis detects external assistance and unauthorized conversations"
    },
    {
      icon: Lock,
      title: "Secure Browser Lock",
      description: "Prevent tab switching, copy-paste, and unauthorized application access during assessments"
    },
    {
      icon: Brain,
      title: "Behavior Analytics",
      description: "AI analyzes patterns to identify cheating attempts and suspicious activities"
    },
    {
      icon: FileText,
      title: "Comprehensive Reports",
      description: "Detailed post-assessment analytics with violation timestamps and evidence"
    }
  ];

  const userRoles = [
    {
      icon: GraduationCap,
      title: "Students & Candidates",
      description: "Take secure exams and interviews with confidence.",
      details: "Experience fair, transparent assessments with our user-friendly interface designed for your success.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Educators & Recruiters",
      description: "Conduct assessments with AI-powered security.",
      details: "Focus on evaluating talent while our AI ensures assessment integrity and provides actionable insights.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Building2,
      title: "Educational & Corporate Institutions",
      description: "Scale your assessment programs securely.",
      details: "Enterprise-grade security and comprehensive analytics for large-scale exam and interview programs.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const steps = [
    {
      icon: Clock,
      title: "Schedule Assessment",
      description: "Create exams or interviews with customizable security settings and invite participants"
    },
    {
      icon: Shield,
      title: "Identity Verification",
      description: "AI verifies participant identity through multi-factor authentication and biometric checks"
    },
    {
      icon: Eye,
      title: "Real-Time Monitoring",
      description: "Continuous AI surveillance detects and flags suspicious behavior without interrupting the flow"
    },
    {
      icon: Award,
      title: "Instant Results",
      description: "Receive detailed security reports and assessment analytics immediately upon completion"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Director of Online Learning",
      institution: "Stanford University",
      quote: "Proctoverse has transformed our remote examination process. The AI detection is remarkably accurate and students appreciate the fair assessment environment.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Talent Acquisition",
      institution: "Google",
      quote: "Our remote interview integrity improved by 85% after implementing Proctoverse. The candidate experience remains smooth while ensuring authenticity.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Prof. Emily Watson",
      role: "Assessment Coordinator",
      institution: "MIT",
      quote: "The detailed analytics and real-time monitoring have revolutionized how we conduct high-stakes examinations. Absolutely recommended!",
      rating: 5,
      avatar: "EW"
    }
  ];

  const screenshots = [
    {
      title: "Student Exam Interface",
      description: "Clean, distraction-free environment with real-time security indicators"
    },
    {
      title: "AI Monitoring Dashboard",
      description: "Live oversight with intelligent alerts and behavior analysis"
    },
    {
      title: "Interview Assessment Portal",
      description: "Comprehensive candidate evaluation with AI-powered insights"
    },
    {
      title: "Analytics & Reports",
      description: "Detailed security reports with violation evidence and timestamps"
    }
  ];

  const detectionAlerts = [
    { icon: Eye, text: "Asked ChatGPT", color: "bg-red-500" },
    { icon: Mic, text: "Answer Prompted", color: "bg-yellow-500" },
    { icon: UserX, text: "Unauthorized Person", color: "bg-orange-500" },
    { icon: Search, text: "Googled Question", color: "bg-blue-500" },
    { icon: Smartphone, text: "Used Phone", color: "bg-purple-500" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-blue-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Proctoverse
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">How it Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">FAQ</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setShowLoginModal(true)} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                Login
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Stats and CTA Buttons */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Bar */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-8 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl border border-blue-200/50">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold">38 Million+ Installs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-700 font-semibold">4.5/5</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Automated Proctoring to
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block mt-2">
                  Prevent Exam Cheating
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our AI tracks candidate activity remotely. So, no more cheating on online tests.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Try Demo
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-xl border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                  Conduct An Exam
                </Button>
              </div>

              <p className="text-blue-600 font-medium">₹8.50 per test</p>
            </div>

            {/* Right Visual with Detection Alerts */}
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-200/50">
                {/* Exam Interface Mockup */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <Camera className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">07:45</span>
                    </div>
                    <div className="flex space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                      <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Student Illustration */}
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                        <Users className="w-12 h-12 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detection Alerts */}
                <div className="space-y-3">
                  {detectionAlerts.map((alert, index) => (
                    <div key={index} className={`flex items-center space-x-3 ${alert.color} text-white px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-102 animate-slide-left`} style={{animationDelay: `${index * 0.2}s`}}>
                      <alert.icon className="w-5 h-5" />
                      <span className="font-medium">{alert.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-24 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Perfect for Every Assessment Need</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              From academic exams to corporate interviews, Proctoverse adapts to your requirements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userRoles.map((role, index) => (
              <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-10 text-center relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className={`w-20 h-20 bg-gradient-to-r ${role.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                    <role.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{role.title}</h3>
                  <p className="text-lg text-blue-600 font-semibold mb-6">{role.description}</p>
                  <p className="text-gray-600 leading-relaxed">{role.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Advanced AI-Powered Features</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Comprehensive monitoring and security features designed for modern assessment needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">How Proctoverse Works</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Simple, secure, and seamless proctoring in four intelligent steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Compliance Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-8">Trusted & Compliant</h2>
          <p className="text-2xl text-blue-100 mb-16 max-w-4xl mx-auto">
            Enterprise-grade security with industry-leading compliance standards
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
            <Badge variant="secondary" className="bg-white/20 text-white text-lg px-8 py-4 border-white/30 backdrop-blur-sm">
              🔒 GDPR Compliant
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white text-lg px-8 py-4 border-white/30 backdrop-blur-sm">
              🏆 ISO 27001
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white text-lg px-8 py-4 border-white/30 backdrop-blur-sm">
              🎓 FERPA Certified
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white text-lg px-8 py-4 border-white/30 backdrop-blur-sm">
              ✅ SOC 2 Type II
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-8 text-left">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white mb-6 italic text-lg">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-blue-100 text-sm">{testimonial.role}</p>
                      <p className="text-blue-200 text-sm">{testimonial.institution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots/Demo Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">See It in Action</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Experience the intuitive interface and powerful monitoring capabilities
            </p>
          </div>

          <div className="relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-blue-200/50">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
                <div className="relative text-center z-10">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Eye className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {screenshots[currentSlide].title}
                  </h3>
                  <p className="text-xl text-gray-600">{screenshots[currentSlide].description}</p>
                </div>
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex justify-center mt-8 space-x-3">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-8">Ready to Transform Your Assessments?</h2>
          <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join thousands of institutions worldwide who trust Proctoverse for secure examinations and interviews
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              Start Free Trial Today
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-xl px-12 py-6 transition-all duration-300 transform hover:scale-105">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">Proctoverse</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                The future of secure online assessments, powered by cutting-edge artificial intelligence technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#security" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                <li><a href="#help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#status" className="text-gray-400 hover:text-white transition-colors">System Status</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
              <p className="text-gray-400 mb-6">Get the latest updates and insights</p>
              <div className="flex gap-3 mb-6">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-gray-800 border-gray-700 text-white flex-1"
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 px-6">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">© 2024 Proctoverse. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
