
import React from 'react';
import { ArrowRight, Clock, Target, CheckCircle, Star, Brain, Trophy, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const FreeAssessment = () => {
  const navigate = useNavigate();

  const handleBeginQuiz = () => {
    navigate('/mcq-test');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ProctoVerse
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Free Technical Assessment
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Get instant insights into your technical skills with our AI-powered assessment
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              100% Free • No Credit Card Required
            </div>
          </div>

          {/* Quiz Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* What's Included */}
            <Card className="bg-white shadow-xl border border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">25 Technical Questions</h4>
                    <p className="text-gray-600 text-sm">Covering programming concepts, algorithms, and problem-solving</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Multiple Choice Format</h4>
                    <p className="text-gray-600 text-sm">Easy to answer with instant feedback</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Hint System</h4>
                    <p className="text-gray-600 text-sm">Get helpful hints when you need them</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Detailed Results</h4>
                    <p className="text-gray-600 text-sm">Comprehensive performance analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Details */}
            <Card className="bg-white shadow-xl border border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                  <Target className="w-6 h-6 text-purple-600" />
                  Quiz Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Duration</span>
                  </div>
                  <span className="text-blue-600 font-bold">30 minutes</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">Questions</span>
                  </div>
                  <span className="text-purple-600 font-bold">25 MCQs</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Difficulty</span>
                  </div>
                  <span className="text-green-600 font-bold">Adaptive</span>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tip</h4>
                  <p className="text-yellow-700 text-sm">
                    Take your time and read each question carefully. You can use hints if needed!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Topics Covered */}
          <Card className="bg-white shadow-xl border border-gray-200 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 text-center">
                Topics Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Programming Logic</h4>
                  <p className="text-gray-600 text-sm">Algorithms, data structures, and problem-solving</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Code Analysis</h4>
                  <p className="text-gray-600 text-sm">Reading and understanding code snippets</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
                  <p className="text-gray-600 text-sm">Software development principles and patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <Button
              onClick={handleBeginQuiz}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Trophy className="w-5 h-5 mr-3" />
              Begin Quiz
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
            <p className="text-gray-500 text-sm mt-4">
              Ready to showcase your technical skills? Let's get started!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeAssessment;
