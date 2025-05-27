
import React from 'react';
import { CheckCircle, XCircle, Lightbulb, Clock, TrendingUp, Award, RotateCcw, User, Mail, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

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

const TestReport: React.FC<TestReportProps> = ({ results, candidateDetails, onBack, onRetakeTest }) => {
  const accuracy = results.answeredQuestions > 0 ? (results.correctAnswers / results.answeredQuestions * 100) : 0;
  const timeEfficiency = (results.timeUsed / results.totalTime * 100);
  const hintUsageRate = results.totalQuestions > 0 ? (results.hintsUsed / results.totalQuestions * 100) : 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Chart data
  const pieChartData = [
    { name: 'Correct', value: results.correctAnswers, fill: '#22c55e' },
    { name: 'Wrong', value: results.wrongAnswers, fill: '#ef4444' },
    { name: 'Unanswered', value: results.totalQuestions - results.answeredQuestions, fill: '#94a3b8' }
  ];

  const barChartData = [
    { name: 'Accuracy', value: accuracy, fill: '#22c55e' },
    { name: 'Time Usage', value: timeEfficiency, fill: '#3b82f6' },
    { name: 'Hint Usage', value: hintUsageRate, fill: '#a855f7' }
  ];

  const chartConfig = {
    correct: { label: 'Correct', color: '#22c55e' },
    wrong: { label: 'Wrong', color: '#ef4444' },
    unanswered: { label: 'Unanswered', color: '#94a3b8' },
    accuracy: { label: 'Accuracy Rate', color: '#22c55e' },
    timeUsage: { label: 'Time Utilization', color: '#3b82f6' },
    hintUsage: { label: 'Hint Usage', color: '#a855f7' }
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
            {/* Candidate Details - Left Side */}
            <Card className="bg-white border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Candidate Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidateDetails ? (
                  <>
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-gray-900 font-medium">{candidateDetails.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900 font-medium">{candidateDetails.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900 font-medium">{candidateDetails.phoneNumber}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">
                    <p>No candidate details available</p>
                  </div>
                )}
              </CardContent>
            </Card>

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

          {/* Performance Analytics with Charts */}
          <Card className="bg-white border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Questions Distribution Pie Chart */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 text-center">Questions Distribution</h3>
                  <ChartContainer config={chartConfig} className="h-64">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Wrong</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                      <span className="text-gray-700">Unanswered</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Bar Chart */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 text-center">Performance Metrics</h3>
                  <ChartContainer config={chartConfig} className="h-64">
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#374151' }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="text-green-600 font-bold text-lg">{accuracy.toFixed(1)}%</div>
                      <div className="text-gray-600">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-bold text-lg">{timeEfficiency.toFixed(1)}%</div>
                      <div className="text-gray-600">Time Usage</div>
                    </div>
                    <div>
                      <div className="text-purple-600 font-bold text-lg">{hintUsageRate.toFixed(1)}%</div>
                      <div className="text-gray-600">Hint Usage</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
