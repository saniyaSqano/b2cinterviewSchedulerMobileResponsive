
import React, { useState } from 'react';
import { Brain, Star, Users, CheckCircle, Trophy, Sparkles, TrendingUp } from 'lucide-react';
import UserInfoForm from './UserInfoForm';
import { useUser } from '../contexts/UserContext';

const WelcomeScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const { user } = useUser();

  if (showForm) {
    return <UserInfoForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 relative overflow-hidden">
      {/* Animated geometric shapes in background */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl transform rotate-45 opacity-20"></div>
      <div className="absolute bottom-40 right-40 w-48 h-48 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl transform -rotate-12 opacity-15"></div>
      <div className="absolute top-1/3 right-10 w-32 h-32 bg-gradient-to-br from-green-300 to-emerald-400 rounded-xl transform rotate-12 opacity-25"></div>
      
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-purple-800/90 backdrop-blur-md border-b border-purple-600/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-green-400 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-purple-800 font-bold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  ProctoVerse
                </h1>
                <p className="text-sm text-purple-200">AI-Powered Learning Platform</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-purple-200 hover:text-white transition-colors text-sm font-medium">
                Solutions
              </a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors text-sm font-medium">
                Resources
              </a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors text-sm font-medium">
                About
              </a>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-purple-800 rounded-lg font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg"
              >
                Get Started
              </button>
            </nav>

            {/* Mobile CTA */}
            <div className="md:hidden">
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-purple-800 rounded-lg font-medium text-sm"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400 mb-6 leading-tight">
              AI learning made smart, secure, and seamless
            </h1>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master your skills with our comprehensive AI-powered platform. Progress through levels, earn credits, and unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-400 text-purple-800 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Learning Now
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-purple-400 text-purple-200 rounded-xl font-semibold hover:bg-purple-400 hover:text-purple-900 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white/5 backdrop-blur-sm border-y border-purple-600/20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white mb-4">
              A new standard in AI-powered learning
            </h2>
            <p className="text-lg text-purple-200 max-w-4xl mx-auto">
              Our AI learning platform is the ideal solution for individuals and organizations seeking comprehensive, 
              scalable, and flexible skill development. It reduces learning time, increases retention, and delivers 
              measurable results through personalized AI guidance.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-400/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-purple-800" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI-Powered Assessment</h3>
              <p className="text-purple-200">
                Intelligent skill evaluation that adapts to your learning style and provides personalized feedback.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-400/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-purple-800" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Gamified Learning</h3>
              <p className="text-purple-200">
                Earn credits, unlock achievements, and progress through levels in an engaging learning environment.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-400/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-purple-800" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Proctored Practice</h3>
              <p className="text-purple-200">
                Secure, monitored practice sessions that simulate real interview and assessment environments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 mb-2">
                95%
              </div>
              <div className="text-purple-200 text-sm">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 mb-2">
                50K+
              </div>
              <div className="text-purple-200 text-sm">Users Trained</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 mb-2">
                24/7
              </div>
              <div className="text-purple-200 text-sm">AI Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 mb-2">
                100+
              </div>
              <div className="text-purple-200 text-sm">Skills Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-purple-400/20 shadow-2xl text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-green-400 rounded-2xl flex items-center justify-center mr-4 animate-spin-slow">
                <Sparkles className="w-8 h-8 text-purple-800" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white">Ready to Transform Your Skills?</h3>
                <p className="text-purple-200">Join thousands of learners already advancing their careers</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="font-semibold text-white mb-1">Certified Training</div>
                <div className="text-sm text-purple-200">Industry-recognized certifications</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div className="font-semibold text-white mb-1">AI-Powered Learning</div>
                <div className="text-sm text-purple-200">Personalized feedback and guidance</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="font-semibold text-white mb-1">Career Growth</div>
                <div className="text-sm text-purple-200">Proven results and outcomes</div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowForm(true)}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-400 text-purple-800 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
