
import React from 'react';
import { CheckCircle, XCircle, Lightbulb, Clock, Award, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import CandidateDetails from './CandidateDetails';
import QuestionsTable from './QuestionsTable';
import PerformanceCharts from './PerformanceCharts';

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  hint: string;
  correctAnswer: number;
}

interface TestReportProps {
  results: {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    hintsUsed: number;
    timeUsed: number;
    totalTime: number;
    score: number;
    passed: boolean;
  };
  questions?: MCQQuestion[];
  candidateDetails?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    skills: string;
    experience: string;
  };
  onBack: () => void;
  onRetakeTest: () => void;
}

const TestReport: React.FC<TestReportProps> = ({ results, questions, candidateDetails, onBack, onRetakeTest }) => {
  console.log('TestReport received questions:', questions);
  
  const accuracy = results.answeredQuestions > 0 ? (results.correctAnswers / results.answeredQuestions * 100) : 0;
  const timeEfficiency = (results.timeUsed / results.totalTime * 100);
  const hintUsageRate = results.totalQuestions > 0 ? (results.hintsUsed / results.totalQuestions * 100) : 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              results.passed ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'
            }`}>
              {results.passed ? (
                <Award className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {results.passed ? 'Congratulations!' : 'Test Completed'}
            </h1>
            <p className="text-gray-600 text-lg">
              {results.passed 
                ? 'You have successfully passed the assessment!' 
                : 'You need 70% or higher to pass. Keep practicing!'}
            </p>
          </div>

          {/* Candidate Details and Score - Side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CandidateDetails candidateDetails={candidateDetails} />

            {/* Score Card - Right Side */}
            <Card className="bg-white border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardHeader className="text-center">
                <CardTitle className="text-gray-900 text-3xl">
                  Your Score: <span className={results.passed ? 'text-green-600' : 'text-red-600'}>
                    {results.score}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      results.passed ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${results.score}%` }}
                  />
                </div>
                <p className="text-center text-gray-600">
                  Passing score: 70% | Your score: {results.score}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Questions Breakdown */}
            <Card className="bg-white border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '600ms' }}>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Questions Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="text-gray-800 font-semibold">{results.totalQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Answered:</span>
                  <span className="text-gray-800 font-semibold">{results.answeredQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600">Correct:</span>
                  <span className="text-green-600 font-semibold">{results.correctAnswers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600">Wrong:</span>
                  <span className="text-red-600 font-semibold">{results.wrongAnswers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Hints Used:</span>
                  <span className="text-purple-600 font-semibold">{results.hintsUsed}</span>
                </div>
              </CardContent>
            </Card>

            {/* Time Analysis */}
            <Card className="bg-white border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '800ms' }}>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Time:</span>
                  <span className="text-gray-800 font-semibold">{formatTime(results.totalTime)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Used:</span>
                  <span className="text-gray-800 font-semibold">{formatTime(results.timeUsed)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Remaining:</span>
                  <span className="text-gray-800 font-semibold">{formatTime(results.totalTime - results.timeUsed)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${timeEfficiency}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Time efficiency: {timeEfficiency.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Questions and Correct Answers */}
          <QuestionsTable questions={questions || []} />

          {/* Performance Analytics with Charts */}
          <PerformanceCharts results={results} />

          {/* Performance Insights */}
          <Card className="bg-white border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '1200ms' }}>
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700">
                {accuracy >= 90 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Excellent accuracy! You have a strong understanding of the concepts.
                  </div>
                )}
                {accuracy >= 70 && accuracy < 90 && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle className="w-4 h-4" />
                    Good accuracy! Consider reviewing the topics where you made mistakes.
                  </div>
                )}
                {accuracy < 70 && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Lightbulb className="w-4 h-4" />
                    Focus on improving accuracy. Review the fundamental concepts before retaking.
                  </div>
                )}
                {hintUsageRate > 50 && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Lightbulb className="w-4 h-4" />
                    High hint usage indicates areas for improvement. Practice without hints to build confidence.
                  </div>
                )}
                {timeEfficiency < 50 && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Clock className="w-4 h-4" />
                    You finished early! Consider double-checking your answers if you have time.
                  </div>
                )}
                {timeEfficiency > 90 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <Clock className="w-4 h-4" />
                    Time was tight! Practice solving questions faster to improve efficiency.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '1400ms' }}>
            <Button
              onClick={onBack}
              className={`px-8 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105 ${
                results.passed 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {results.passed ? 'Continue to Next Level' : 'Back to Dashboard'}
            </Button>
            {!results.passed && (
              <Button
                onClick={onRetakeTest}
                variant="ghost"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105 border border-purple-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Test
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReport;
