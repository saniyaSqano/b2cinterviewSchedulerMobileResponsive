
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, X, Timer, Lightbulb, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

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
  timeLimit: number;
}

interface GamethonChallengeProps {
  challenge: CodingChallenge;
  onBack: () => void;
  onComplete: (score: number, timeTaken: number) => void;
}

const GamethonChallenge: React.FC<GamethonChallengeProps> = ({ challenge, onBack, onComplete }) => {
  const [code, setCode] = useState(challenge.initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, expected: string, actual: string}>>([]);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit * 60); // Convert to seconds
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeUp = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const score = Math.round(challenge.points * 0.3); // 30% points for timeout
    onComplete(score, timeTaken);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);

    try {
      // Simple code execution simulation
      // In a real implementation, you'd use a secure code execution service
      const results: Array<{passed: boolean, expected: string, actual: string}> = [];
      
      // Create a simple test environment
      const testFunction = new Function('return ' + code)();
      
      for (const testCase of challenge.testCases) {
        try {
          let result;
          if (testCase.input) {
            const inputs = testCase.input.split(', ').map(input => {
              // Try to parse as number, fallback to string
              if (input.startsWith('[') && input.endsWith(']')) {
                // Parse array
                return JSON.parse(input);
              }
              const num = parseFloat(input);
              return isNaN(num) ? input.replace(/['"]/g, '') : num;
            });
            result = testFunction(...inputs);
          } else {
            result = testFunction();
          }
          
          const actualOutput = String(result);
          const passed = actualOutput === testCase.expectedOutput;
          
          results.push({
            passed,
            expected: testCase.expectedOutput,
            actual: actualOutput
          });
        } catch (error) {
          results.push({
            passed: false,
            expected: testCase.expectedOutput,
            actual: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      }
      
      setTestResults(results);
      
      const passedTests = results.filter(r => r.passed).length;
      const totalTests = results.length;
      
      if (passedTests === totalTests) {
        setOutput('✅ All tests passed! Great job!');
        const timeTaken = (Date.now() - startTime) / 1000;
        const timeBonus = Math.max(0, (challenge.timeLimit * 60 - timeTaken) / (challenge.timeLimit * 60));
        const score = Math.round(challenge.points * (1 + timeBonus * 0.5));
        
        setTimeout(() => {
          onComplete(score, timeTaken);
        }, 2000);
      } else {
        setOutput(`❌ ${passedTests}/${totalTests} tests passed. Keep trying!`);
      }
      
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Code execution failed'}`);
      setTestResults([{
        passed: false,
        expected: 'Valid code',
        actual: `Syntax Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]);
    }
    
    setIsRunning(false);
  };

  const getHint = () => {
    const hints: Record<string, string> = {
      "Hello World": "Try returning the exact string 'Hello, World!' from your function.",
      "Sum of Two Numbers": "Use the + operator to add the two parameters together.",
      "Reverse a String": "You can use the split(''), reverse(), and join('') methods, or implement a loop.",
      "Find Maximum in Array": "You can use Math.max(...arr) or iterate through the array keeping track of the maximum value.",
      "Fibonacci Sequence": "Remember: F(n) = F(n-1) + F(n-2), with F(1) = 1 and F(2) = 1. You can use recursion or iteration."
    };
    
    return hints[challenge.title] || "Think about the problem step by step and break it down into smaller parts.";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-purple-600 font-medium">{challenge.points} points</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">{challenge.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Timer className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problem Description */}
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-md shadow-xl animate-fade-in border border-white/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Target className="w-6 h-6" />
                    Challenge Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">{challenge.description}</p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200/50">
                    <h4 className="font-semibold text-blue-800 mb-2">Expected Output:</h4>
                    <code className="text-blue-900 bg-blue-100 px-2 py-1 rounded text-sm">
                      {challenge.expectedOutput}
                    </code>
                  </div>
                </CardContent>
              </Card>

              {/* Test Cases */}
              <Card className="bg-white/90 backdrop-blur-md shadow-xl animate-fade-in border border-white/50" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <CheckCircle className="w-6 h-6" />
                    Test Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {challenge.testCases.map((testCase, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Input:</span>
                            <code className="block text-gray-800 mt-1">{testCase.input || 'No input'}</code>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Expected:</span>
                            <code className="block text-gray-800 mt-1">{testCase.expectedOutput}</code>
                          </div>
                        </div>
                        {testResults[index] && (
                          <div className={`mt-2 p-2 rounded text-sm ${
                            testResults[index].passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {testResults[index].passed ? '✅ Passed' : `❌ Failed: Got "${testResults[index].actual}"`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Hint Section */}
              <Card className="bg-white/90 backdrop-blur-md shadow-xl animate-fade-in border border-white/50" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Lightbulb className="w-6 h-6" />
                    Need a Hint?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showHint ? (
                    <Button
                      onClick={() => setShowHint(true)}
                      variant="outline"
                      className="w-full border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Show Hint
                    </Button>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200/50">
                      <p className="text-yellow-800">{getHint()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Code Editor */}
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-md shadow-xl animate-fade-in border border-white/50" style={{ animationDelay: '600ms' }}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-purple-800">
                    <div className="flex items-center gap-2">
                      <span>💻</span>
                      Code Editor
                    </div>
                    <Button
                      onClick={runCode}
                      disabled={isRunning}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      {isRunning ? (
                        <>
                          <span className="animate-spin w-4 h-4 mr-2">⏳</span>
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run Code
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 font-mono text-sm bg-gray-900 text-green-400 border-2 border-gray-700 rounded-lg p-4 resize-none"
                    placeholder="Write your code here..."
                    style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
                  />
                </CardContent>
              </Card>

              {/* Output */}
              <Card className="bg-white/90 backdrop-blur-md shadow-xl animate-fade-in border border-white/50" style={{ animationDelay: '800ms' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <span>📤</span>
                    Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-24 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm border-2 border-gray-700">
                    {output || 'Click "Run Code" to see the output...'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamethonChallenge;
