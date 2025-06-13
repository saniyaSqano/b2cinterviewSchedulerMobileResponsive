
import React, { useState } from 'react';
import { ArrowRight, Play, CheckCircle, Shield, Eye, Lock, Mic, BarChart3, Users, GraduationCap, Building2, ChevronLeft, ChevronRight, Star, Globe, Mail, Twitter, Linkedin, Facebook } from 'lucide-react';
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
      title: "Real-Time AI Monitoring",
      description: "Advanced facial recognition and eye tracking to ensure authentic test-taking"
    },
    {
      icon: Lock,
      title: "Browser Lockdown",
      description: "Prevent tab switching and unauthorized applications during exams"
    },
    {
      icon: Mic,
      title: "Voice Detection",
      description: "Audio analysis to detect suspicious conversations or background noise"
    },
    {
      icon: Users,
      title: "Multi-Person Detection",
      description: "AI identifies multiple people in the frame to prevent collaboration"
    },
    {
      icon: BarChart3,
      title: "Detailed Reports",
      description: "Comprehensive post-exam analytics and violation summaries"
    },
    {
      icon: Shield,
      title: "Live Proctor Integration",
      description: "Optional human oversight for high-stakes examinations"
    }
  ];

  const userRoles = [
    {
      icon: GraduationCap,
      title: "Students",
      description: "Take secure exams anytime, anywhere.",
      details: "Experience seamless, stress-free testing with our intuitive interface designed for your success."
    },
    {
      icon: Users,
      title: "Educators",
      description: "Monitor exams effortlessly with AI assistance.",
      details: "Focus on teaching while our AI handles exam security and provides actionable insights."
    },
    {
      icon: Building2,
      title: "Institutions",
      description: "Get insights, reports, and peace of mind.",
      details: "Scale your assessment programs with enterprise-grade security and comprehensive analytics."
    }
  ];

  const steps = [
    {
      title: "Schedule or Start the Exam",
      description: "Set up your exam parameters and invite students through our intuitive dashboard"
    },
    {
      title: "Verify Student Identity",
      description: "AI-powered identity verification ensures the right person is taking the exam"
    },
    {
      title: "AI Monitors in Real Time",
      description: "Continuous monitoring detects suspicious behavior without interrupting the exam"
    },
    {
      title: "Receive Detailed Report",
      description: "Get comprehensive insights and violation reports immediately after exam completion"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Dean of Online Education",
      institution: "Tech University",
      quote: "Proctoverse has revolutionized our online assessment capabilities. The AI monitoring is incredibly accurate.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "IT Director",
      institution: "Global Institute",
      quote: "Implementation was seamless, and our exam integrity scores have improved by 40%.",
      rating: 5
    },
    {
      name: "Prof. Emily Rodriguez",
      role: "Course Coordinator",
      institution: "State College",
      quote: "Students appreciate the fair and transparent proctoring process. Highly recommended!",
      rating: 5
    }
  ];

  const screenshots = [
    {
      title: "Student Exam Interface",
      description: "Clean, distraction-free exam environment"
    },
    {
      title: "AI Alert Dashboard",
      description: "Real-time monitoring and violation detection"
    },
    {
      title: "Report Summary",
      description: "Comprehensive post-exam analytics"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Proctoverse
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setShowLoginModal(true)}>
                Login
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Register
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Proctoring for the
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Future of Exams
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Ensure exam integrity with smart, scalable, and secure AI proctoring. 
            Experience the next generation of online assessment technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2">
              <Play className="w-5 h-5 mr-2" />
              Request a Demo
            </Button>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">AI Proctoring Demo Interface</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Everyone</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a student, educator, or institution, Proctoverse adapts to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userRoles.map((role, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <role.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{role.title}</h3>
                  <p className="text-lg text-blue-600 font-semibold mb-4">{role.description}</p>
                  <p className="text-gray-600 leading-relaxed">{role.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI-powered monitoring and security features designed for modern education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and seamless proctoring in four easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Compliance Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Trust & Compliance</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Your data is encrypted and your privacy is protected with industry-leading security standards
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            <Badge variant="secondary" className="bg-white/20 text-white text-lg px-6 py-3 border-white/30">
              GDPR Compliant
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white text-lg px-6 py-3 border-white/30">
              ISO 27001
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white text-lg px-6 py-3 border-white/30">
              FERPA Certified
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white text-lg px-6 py-3 border-white/30">
              SOC 2 Type II
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-left">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-blue-100 text-sm">{testimonial.role}</p>
                    <p className="text-blue-200 text-sm">{testimonial.institution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots/Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See It in Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the intuitive interface and powerful monitoring capabilities
            </p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {screenshots[currentSlide].title}
                  </h3>
                  <p className="text-gray-600">{screenshots[currentSlide].description}</p>
                </div>
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex justify-center mt-6 space-x-2">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Proctor Smarter?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of institutions already using Proctoverse for secure online assessments
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
              Create Your Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Proctoverse</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The future of secure online assessment technology, powered by artificial intelligence.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#security" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#status" className="text-gray-400 hover:text-white transition-colors">System Status</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Subscribe for updates and insights</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
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
