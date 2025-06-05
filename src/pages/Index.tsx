import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Users, 
  Brain, 
  Trophy, 
  Zap, 
  Code, 
  Target, 
  Star,
  Gamepad2,
  Timer,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UserInfoForm from '@/components/UserInfoForm';
import AssessmentFlow from '@/components/AssessmentFlow';
import Level3Flow from '@/components/Level3Flow';
import Level4Flow from '@/components/Level4Flow';
import Level5Flow from '@/components/Level5Flow';
import GamethonFlow from '@/components/GamethonFlow';
import InteractiveRoadmap from '@/components/InteractiveRoadmap';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [userName, setUserName] = useState('');
  const [assessmentPassed, setAssessmentPassed] = useState(false);

  const handleUserSubmit = (userData: { name: string; email: string; phone: string }) => {
    setUserName(userData.name);
    setCurrentView('roadmap');
  };

  const handleAssessmentPass = () => {
    setAssessmentPassed(true);
  };

  if (currentView === 'userInfo') {
    return <UserInfoForm onSubmit={handleUserSubmit} />;
  }

  if (currentView === 'roadmap') {
    return <InteractiveRoadmap onBack={() => setCurrentView('home')} userName={userName} />;
  }

  if (currentView === 'assessment') {
    return <AssessmentFlow onBack={() => setCurrentView('home')} onTestPassed={handleAssessmentPass} />;
  }

  if (currentView === 'level3') {
    return <Level3Flow onBack={() => setCurrentView('home')} userName={userName} />;
  }

  if (currentView === 'level4') {
    return <Level4Flow onBack={() => setCurrentView('home')} userName={userName} />;
  }

  if (currentView === 'level5') {
    return <Level5Flow onBack={() => setCurrentView('home')} userName={userName} />;
  }

  if (currentView === 'gamethon') {
    return <GamethonFlow onBack={() => setCurrentView('home')} userName={userName} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              🚀 AI-Powered Interview Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master your skills through comprehensive assessments, interactive learning, and AI-driven feedback
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* User Info Card */}
            <Card className="bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in border border-white/50" onClick={() => setCurrentView('userInfo')}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Step 1
                  </Badge>
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Start your journey by providing your basic information for a personalized experience.</p>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Learning Roadmap Card */}
            <Card className="bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in border border-white/50" style={{ animationDelay: '200ms' }} onClick={() => setCurrentView('roadmap')}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Explore
                  </Badge>
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Interactive Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Explore our comprehensive learning path designed to guide you through skill development.</p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                  <Target className="w-4 h-4 mr-2" />
                  View Roadmap
                </Button>
              </CardContent>
            </Card>

            {/* Gamethon Card - Enhanced with Motion Graphics */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card 
                className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 backdrop-blur-md shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer border-2 border-purple-200/50 hover:border-purple-400/70 relative overflow-hidden"
                onClick={() => setCurrentView('gamethon')}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-floating-particle-1"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-pink-400 rounded-full animate-floating-particle-2"></div>
                <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-floating-particle-3"></div>
                
                {/* Sparkle Effect */}
                <motion.div
                  className="absolute top-2 left-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400 opacity-70" />
                </motion.div>

                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200/50 shadow-sm"
                      >
                        🎮 Gaming
                      </Badge>
                    </motion.div>
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      }}
                    >
                      <Gamepad2 className="w-7 h-7 text-purple-600" />
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                      <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                        Gamethon Challenge
                      </span>
                    </CardTitle>
                  </motion.div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <motion.p 
                    className="text-gray-700 mb-6 text-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    🚀 Level up your coding skills through gamified challenges! Complete interactive coding puzzles, earn points, and climb the leaderboard.
                  </motion.p>
                  
                  {/* Feature highlights with animations */}
                  <motion.div 
                    className="grid grid-cols-2 gap-3 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.div 
                      className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 rounded-lg p-2"
                      whileHover={{ scale: 1.05, backgroundColor: "rgb(237 233 254)" }}
                    >
                      <Code className="w-4 h-4" />
                      <span className="font-medium">Live Coding</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2 text-sm text-pink-700 bg-pink-50 rounded-lg p-2"
                      whileHover={{ scale: 1.05, backgroundColor: "rgb(253 242 248)" }}
                    >
                      <Timer className="w-4 h-4" />
                      <span className="font-medium">Time Challenges</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2 text-sm text-indigo-700 bg-indigo-50 rounded-lg p-2"
                      whileHover={{ scale: 1.05, backgroundColor: "rgb(238 242 255)" }}
                    >
                      <Trophy className="w-4 h-4" />
                      <span className="font-medium">Score Points</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2"
                      whileHover={{ scale: 1.05, backgroundColor: "rgb(240 253 244)" }}
                    >
                      <Award className="w-4 h-4" />
                      <span className="font-medium">Achievements</span>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                      {/* Button animation overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="relative flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5 group-hover:animate-bounce" />
                        <span className="font-semibold">Start Gaming</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Button>
                  </motion.div>
                </CardContent>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              </Card>
            </motion.div>

            {/* Assessment Card */}
            <Card className="bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in border border-white/50" style={{ animationDelay: '600ms' }} onClick={() => setCurrentView('assessment')}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Level 1
                  </Badge>
                  <Brain className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Skill Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Test your knowledge with our comprehensive assessment to unlock advanced features.</p>
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                  <Brain className="w-4 h-4 mr-2" />
                  Take Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Level 3 Card */}
            <Card className="bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in border border-white/50" style={{ animationDelay: '800ms' }} onClick={() => setCurrentView('level3')}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Level 3
                  </Badge>
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Advanced Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Advanced interview scenarios with real-time feedback and performance analytics.</p>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  <Star className="w-4 h-4 mr-2" />
                  Start Practice
                </Button>
              </CardContent>
            </Card>

            {/* Level 4 Card */}
            <Card className="bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in border border-white/50" style={{ animationDelay: '1000ms' }} onClick={() => setCurrentView('level4')}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    Level 4
                  </Badge>
                  <Trophy className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">AI Mock Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Experience realistic interview scenarios with our advanced AI interviewer.</p>
                <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
                  <Trophy className="w-4 h-4 mr-2" />
                  Start Interview
                </Button>
              </CardContent>
            </Card>

            {/* Level 5 Card */}
            <Card className="bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in border border-white/50" style={{ animationDelay: '1200ms' }} onClick={() => setCurrentView('level5')}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                    Level 5
                  </Badge>
                  <Zap className="w-6 h-6 text-violet-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Proctored Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Take supervised assessments with advanced proctoring and monitoring features.</p>
                <Button className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  Begin Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
