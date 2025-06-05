
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Trophy, Star, Code, Zap, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import GamethonChallenge from './GamethonChallenge';
import GamethonResults from './GamethonResults';

interface CodingChallenge {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  initialCode: string;
  expectedOutput: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  points: number;
  timeLimit: number; // in minutes
}

interface GamethonFlowProps {
  onBack: () => void;
  userName: string;
}

const GamethonFlow: React.FC<GamethonFlowProps> = ({ onBack, userName }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState<number[]>([]);

  const challenges: CodingChallenge[] = [
    {
      id: 1,
      title: "Hello World",
      difficulty: "Easy",
      description: "Write a function that returns 'Hello, World!'",
      initialCode: `function helloWorld() {
  // Write your code here
  
}`,
      expectedOutput: "Hello, World!",
      testCases: [
        { input: "", expectedOutput: "Hello, World!" }
      ],
      points: 100,
      timeLimit: 5
    },
    {
      id: 2,
      title: "Sum of Two Numbers",
      difficulty: "Easy",
      description: "Write a function that takes two numbers and returns their sum",
      initialCode: `function sum(a, b) {
  // Write your code here
  
}`,
      expectedOutput: "5",
      testCases: [
        { input: "2, 3", expectedOutput: "5" },
        { input: "10, 20", expectedOutput: "30" },
        { input: "-5, 15", expectedOutput: "10" }
      ],
      points: 150,
      timeLimit: 8
    },
    {
      id: 3,
      title: "Reverse a String",
      difficulty: "Medium",
      description: "Write a function that reverses a given string",
      initialCode: `function reverseString(str) {
  // Write your code here
  
}`,
      expectedOutput: "olleh",
      testCases: [
        { input: "hello", expectedOutput: "olleh" },
        { input: "world", expectedOutput: "dlrow" },
        { input: "JavaScript", expectedOutput: "tpircSavaJ" }
      ],
      points: 200,
      timeLimit: 10
    },
    {
      id: 4,
      title: "Find Maximum in Array",
      difficulty: "Medium",
      description: "Write a function that finds the maximum number in an array",
      initialCode: `function findMax(arr) {
  // Write your code here
  
}`,
      expectedOutput: "9",
      testCases: [
        { input: "[1, 5, 3, 9, 2]", expectedOutput: "9" },
        { input: "[10, 25, 8, 15]", expectedOutput: "25" },
        { input: "[-1, -5, -2]", expectedOutput: "-1" }
      ],
      points: 250,
      timeLimit: 12
    },
    {
      id: 5,
      title: "Fibonacci Sequence",
      difficulty: "Hard",
      description: "Write a function that returns the nth Fibonacci number",
      initialCode: `function fibonacci(n) {
  // Write your code here
  
}`,
      expectedOutput: "8",
      testCases: [
        { input: "6", expectedOutput: "8" },
        { input: "10", expectedOutput: "55" },
        { input: "1", expectedOutput: "1" }
      ],
      points: 300,
      timeLimit: 15
    }
  ];

  const handleLevelSelect = (index: number) => {
    setCurrentLevel(index);
    setShowChallenge(true);
  };

  const handleChallengeComplete = (score: number, timeTaken: number) => {
    const newScores = [...scores];
    const newTimeSpent = [...timeSpent];
    newScores[currentLevel] = score;
    newTimeSpent[currentLevel] = timeTaken;
    
    setScores(newScores);
    setTimeSpent(newTimeSpent);
    
    if (!completedLevels.includes(currentLevel)) {
      setCompletedLevels(prev => [...prev, currentLevel]);
    }
    
    setTotalScore(newScores.reduce((sum, s) => sum + (s || 0), 0));
    setShowChallenge(false);
    
    // If all levels completed, show results
    if (completedLevels.length + 1 >= challenges.length) {
      setShowResults(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return <Star className="w-4 h-4" />;
      case 'Medium': return <Target className="w-4 h-4" />;
      case 'Hard': return <Zap className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  if (showResults) {
    return (
      <GamethonResults
        scores={scores}
        timeSpent={timeSpent}
        challenges={challenges}
        totalScore={totalScore}
        onBack={() => {
          setShowResults(false);
          onBack();
        }}
        userName={userName}
      />
    );
  }

  if (showChallenge) {
    return (
      <GamethonChallenge
        challenge={challenges[currentLevel]}
        onBack={() => setShowChallenge(false)}
        onComplete={handleChallengeComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                🎮 Gamethon Challenge
              </h1>
              <p className="text-gray-600 mt-2">Test your coding skills through interactive challenges</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl px-4 py-2 border border-purple-200/50">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-800 font-bold">{totalScore}</span>
                  <span className="text-purple-600 text-sm">pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="mb-8 bg-white/90 backdrop-blur-md shadow-xl animate-fade-in border border-white/50" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Code className="w-6 h-6" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                  <div className="text-2xl font-bold text-green-600">{completedLevels.length}</div>
                  <div className="text-green-700 text-sm font-medium">Completed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                  <div className="text-2xl font-bold text-blue-600">{challenges.length - completedLevels.length}</div>
                  <div className="text-blue-700 text-sm font-medium">Remaining</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/50">
                  <div className="text-2xl font-bold text-purple-600">{totalScore}</div>
                  <div className="text-purple-700 text-sm font-medium">Total Score</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200/50">
                  <div className="text-2xl font-bold text-amber-600">
                    {Math.round((completedLevels.length / challenges.length) * 100)}%
                  </div>
                  <div className="text-amber-700 text-sm font-medium">Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Challenge Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <Card 
                key={challenge.id} 
                className={`bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in border border-white/50 ${
                  completedLevels.includes(index) ? 'ring-2 ring-green-500/50' : ''
                }`}
                style={{ animationDelay: `${400 + index * 100}ms` }}
                onClick={() => handleLevelSelect(index)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDifficultyColor(challenge.difficulty)}`}>
                      {getDifficultyIcon(challenge.difficulty)}
                      {challenge.difficulty}
                    </span>
                    {completedLevels.includes(index) && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </span>
                    {challenge.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 leading-relaxed">{challenge.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Trophy className="w-4 h-4 text-purple-500" />
                      <span>{challenge.points} pts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{challenge.timeLimit} min</span>
                    </div>
                  </div>

                  {completedLevels.includes(index) && scores[index] !== undefined && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 font-medium">Score: {scores[index]} pts</span>
                        <span className="text-green-600 text-sm">
                          Time: {Math.round(timeSpent[index] || 0)}s
                        </span>
                      </div>
                    </div>
                  )}

                  <Button 
                    className={`w-full ${
                      completedLevels.includes(index) 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    } text-white rounded-lg transition-all duration-200`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {completedLevels.includes(index) ? 'Retry Challenge' : 'Start Challenge'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Stats */}
          {completedLevels.length > 0 && (
            <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
              <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Challenge Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{totalScore}</div>
                    <div className="text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {timeSpent.reduce((sum, time) => sum + (time || 0), 0).toFixed(0)}s
                    </div>
                    <div className="text-gray-600">Total Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {completedLevels.length > 0 ? Math.round(totalScore / completedLevels.length) : 0}
                    </div>
                    <div className="text-gray-600">Avg Score</div>
                  </div>
                </div>
                
                {completedLevels.length === challenges.length && (
                  <Button
                    onClick={() => setShowResults(true)}
                    className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    View Final Results
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamethonFlow;
