
import React from 'react';
import { CheckCircle, XCircle, Lightbulb, Clock, TrendingUp, Award, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ParticleBackground from './ParticleBackground';

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
  onBack: () => void;
  onRetakeTest: () => void;
}

const TestReport: React.FC<TestReportProps> = ({ results, onBack, onRetakeTest }) => {
  const accuracy = results.answeredQuestions > 0 ? (results.correctAnswers / results.answeredQuestions * 100) : 0;
  const timeEfficiency = (results.timeUsed / results.totalTime * 100);
  const hintUsageRate = results.totalQuestions > 0 ? (results.hintsUsed / results.totalQuestions * 100) : 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              results.passed ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'
            }`}>
              {results.passed ? (
                <Award className="w-10 h-10 text-green-500" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500" />
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {results.passed ? 'Congratulations!' : 'Test Completed'}
            </h1>
            <p className="text-slate-300 text-lg">
              {results.passed 
                ? 'You have successfully passed the assessment!' 
                : 'You need 70% or higher to pass. Keep practicing!'}
            </p>
          </div>

          {/* Score Card */}
          <Card className="bg-slate-900 border-slate-700 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="text-center">
              <CardTitle className="text-white text-3xl">
                Your Score: <span className={results.passed ? 'text-green-500' : 'text-red-500'}>
                  {results.score}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-slate-700 rounded-full h-4 mb-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    results.passed ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${results.score}%` }}
                />
              </div>
              <p className="text-center text-slate-300">
                Passing score: 70% | Your score: {results.score}%
              </p>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Questions Breakdown */}
            <Card className="bg-slate-900 border-slate-700 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Questions Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Total Questions:</span>
                  <span className="text-white font-semibold">{results.totalQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Answered:</span>
                  <span className="text-white font-semibold">{results.answeredQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400">Correct:</span>
                  <span className="text-green-400 font-semibold">{results.correctAnswers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-400">Wrong:</span>
                  <span className="text-red-400 font-semibold">{results.wrongAnswers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-400">Hints Used:</span>
                  <span className="text-purple-400 font-semibold">{results.hintsUsed}</span>
                </div>
              </CardContent>
            </Card>

            {/* Time Analysis */}
            <Card className="bg-slate-900 border-slate-700 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Total Time:</span>
                  <span className="text-white font-semibold">{formatTime(results.totalTime)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Time Used:</span>
                  <span className="text-white font-semibold">{formatTime(results.timeUsed)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Time Remaining:</span>
                  <span className="text-white font-semibold">{formatTime(results.totalTime - results.timeUsed)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${timeEfficiency}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Time efficiency: {timeEfficiency.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics */}
          <Card className="bg-slate-900 border-slate-700 mb-8 animate-fade-in" style={{ animationDelay: '800ms' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">{accuracy.toFixed(1)}%</div>
                  <div className="text-slate-300">Accuracy Rate</div>
                  <div className="text-xs text-slate-400 mt-1">Correct answers / Total answered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">{timeEfficiency.toFixed(1)}%</div>
                  <div className="text-slate-300">Time Utilization</div>
                  <div className="text-xs text-slate-400 mt-1">Time used / Total time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">{hintUsageRate.toFixed(1)}%</div>
                  <div className="text-slate-300">Hint Usage</div>
                  <div className="text-xs text-slate-400 mt-1">Hints used / Total questions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="bg-slate-900 border-slate-700 mb-8 animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-slate-300">
                {accuracy >= 90 && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    Excellent accuracy! You have a strong understanding of the concepts.
                  </div>
                )}
                {accuracy >= 70 && accuracy < 90 && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <CheckCircle className="w-4 h-4" />
                    Good accuracy! Consider reviewing the topics where you made mistakes.
                  </div>
                )}
                {accuracy < 70 && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Lightbulb className="w-4 h-4" />
                    Focus on improving accuracy. Review the fundamental concepts before retaking.
                  </div>
                )}
                {hintUsageRate > 50 && (
                  <div className="flex items-center gap-2 text-purple-400">
                    <Lightbulb className="w-4 h-4" />
                    High hint usage indicates areas for improvement. Practice without hints to build confidence.
                  </div>
                )}
                {timeEfficiency < 50 && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <Clock className="w-4 h-4" />
                    You finished early! Consider double-checking your answers if you have time.
                  </div>
                )}
                {timeEfficiency > 90 && (
                  <div className="flex items-center gap-2 text-orange-400">
                    <Clock className="w-4 h-4" />
                    Time was tight! Practice solving questions faster to improve efficiency.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '1200ms' }}>
            <Button
              onClick={onBack}
              className={`px-8 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105 ${
                results.passed 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-slate-600 hover:bg-slate-700'
              }`}
            >
              {results.passed ? 'Continue to Next Level' : 'Back to Dashboard'}
            </Button>
            {!results.passed && (
              <Button
                onClick={onRetakeTest}
                variant="ghost"
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-8 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
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
