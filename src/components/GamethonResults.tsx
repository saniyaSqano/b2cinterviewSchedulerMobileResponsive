
import React from 'react';
import { ArrowLeft, Trophy, Star, Clock, Target, Award, Download, Share } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface CodingChallenge {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
}

interface GamethonResultsProps {
  scores: number[];
  timeSpent: number[];
  challenges: CodingChallenge[];
  totalScore: number;
  onBack: () => void;
  userName: string;
}

const GamethonResults: React.FC<GamethonResultsProps> = ({
  scores,
  timeSpent,
  challenges,
  totalScore,
  onBack,
  userName
}) => {
  const completedChallenges = scores.filter(score => score > 0).length;
  const totalPossibleScore = challenges.reduce((sum, challenge) => sum + challenge.points, 0);
  const successRate = Math.round((totalScore / totalPossibleScore) * 100);
  const averageTime = timeSpent.length > 0 ? timeSpent.reduce((sum, time) => sum + time, 0) / timeSpent.length : 0;

  const getPerformanceLevel = () => {
    if (successRate >= 90) return { level: 'Exceptional', color: 'text-purple-600', icon: Trophy };
    if (successRate >= 75) return { level: 'Excellent', color: 'text-green-600', icon: Star };
    if (successRate >= 60) return { level: 'Good', color: 'text-blue-600', icon: Target };
    if (successRate >= 40) return { level: 'Fair', color: 'text-yellow-600', icon: Award };
    return { level: 'Needs Improvement', color: 'text-red-600', icon: Target };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const generateCertificate = () => {
    // In a real implementation, this would generate a PDF certificate
    console.log('Generating certificate for', userName);
    alert('Certificate generation feature would be implemented here!');
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Gamethon Results',
        text: `I just completed the coding challenges and scored ${totalScore} points! 🎮💻`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `I just completed the coding challenges and scored ${totalScore} points! 🎮💻`;
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in">
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                🎉 Gamethon Complete!
              </h1>
              <p className="text-gray-600 mt-2">Congratulations on completing the coding challenges</p>
            </div>
            <div className="w-12"></div>
          </div>

          {/* Main Results Card */}
          <Card className="bg-white/90 backdrop-blur-md shadow-2xl animate-fade-in border border-white/50" style={{ animationDelay: '200ms' }}>
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-4 border-white flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-4xl font-bold text-white">{successRate}%</div>
                    <div className="text-sm text-white/90 font-medium">Success</div>
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-3xl mb-4 flex items-center justify-center gap-3">
                <PerformanceIcon className={`w-8 h-8 ${performance.color}`} />
                <span className={performance.color}>
                  {performance.level} Performance!
                </span>
              </CardTitle>
              
              <p className="text-lg text-gray-700 mb-6">
                Great job {userName}! You've demonstrated excellent problem-solving skills.
              </p>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <div className="text-2xl font-bold text-purple-600">{totalScore}</div>
                  <div className="text-gray-600 text-sm">Total Score</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <div className="text-2xl font-bold text-green-600">{completedChallenges}</div>
                  <div className="text-gray-600 text-sm">Completed</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(averageTime)}s</div>
                  <div className="text-gray-600 text-sm">Avg Time</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <div className="text-2xl font-bold text-orange-600">{successRate}%</div>
                  <div className="text-gray-600 text-sm">Accuracy</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Detailed Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Challenge Breakdown */}
            <Card className="bg-white/90 backdrop-blur-md shadow-xl animate-fade-in border border-white/50" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Target className="w-6 h-6" />
                  Challenge Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges.map((challenge, index) => (
                  <div key={challenge.id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{scores[index] || 0}</div>
                        <div className="text-xs text-gray-500">/{challenge.points} pts</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.round(timeSpent[index] || 0)}s</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {scores[index] > 0 ? (
                          <><Star className="w-4 h-4 text-green-500" /> Completed</>
                        ) : (
                          <><Target className="w-4 h-4 text-gray-400" /> Not attempted</>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Analysis */}
            <Card className="bg-white/90 backdrop-blur-md shadow-xl animate-fade-in border border-white/50" style={{ animationDelay: '600ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Award className="w-6 h-6" />
                  Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Performance */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200/50">
                  <div className="flex items-center gap-4 mb-4">
                    <PerformanceIcon className={`w-8 h-8 ${performance.color}`} />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Overall Rating</h3>
                      <p className={`text-xl font-semibold ${performance.color}`}>{performance.level}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">{successRate}% Success Rate</p>
                </div>

                {/* Detailed Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-green-600" />
                      <span className="font-medium text-gray-800">Challenges Completed</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{completedChallenges}</div>
                      <div className="text-sm text-gray-500">out of {challenges.length}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <span className="font-medium text-gray-800">Total Time Spent</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{Math.round(timeSpent.reduce((sum, time) => sum + time, 0))}s</div>
                      <div className="text-sm text-gray-500">Avg: {Math.round(averageTime)}s per challenge</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/50">
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-purple-600" />
                      <span className="font-medium text-gray-800">Efficiency Score</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {completedChallenges > 0 ? Math.round(totalScore / completedChallenges) : 0}
                      </div>
                      <div className="text-sm text-gray-500">Avg points per challenge</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
            <Button
              onClick={onBack}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-full text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Back to Challenges
            </Button>
            
            <Button
              onClick={generateCertificate}
              variant="outline"
              className="px-8 py-4 rounded-full text-lg font-medium border-2 border-purple-300 text-purple-600 hover:bg-purple-50 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Certificate
            </Button>
            
            <Button
              onClick={shareResults}
              variant="outline"
              className="px-8 py-4 rounded-full text-lg font-medium border-2 border-blue-300 text-blue-600 hover:bg-blue-50 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Share className="w-5 h-5 mr-2" />
              Share Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamethonResults;
