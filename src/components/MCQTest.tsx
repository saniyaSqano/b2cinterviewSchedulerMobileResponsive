
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  hint: string;
  correctAnswer: number;
}

interface MCQTestProps {
  totalQuestions: number;
  timeFrame: number;
  onBack: () => void;
  onComplete: (results: any, questions: MCQQuestion[]) => void;
}

const MCQTest: React.FC<MCQTestProps> = ({ totalQuestions, timeFrame, onBack, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(timeFrame * 60);
  const [isComplete, setIsComplete] = useState(false);

  // 3 sample technical questions
  const questions: MCQQuestion[] = [
    {
      id: 1,
      question: "What is the time complexity of searching for an element in a balanced binary search tree?",
      options: [
        "O(n)",
        "O(log n)", 
        "O(n log n)",
        "O(1)"
      ],
      hint: "Think about how you traverse a balanced tree by eliminating half the nodes at each step.",
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Which of the following is NOT a principle of Object-Oriented Programming?",
      options: [
        "Encapsulation",
        "Inheritance",
        "Recursion",
        "Polymorphism"
      ],
      hint: "Consider which concept is more related to algorithm design rather than OOP structure.",
      correctAnswer: 2
    },
    {
      id: 3,
      question: "In JavaScript, what will be the output of: console.log(typeof null)?",
      options: [
        "null",
        "undefined",
        "object",
        "boolean"
      ],
      hint: "This is a well-known quirk in JavaScript's type system that has historical reasons.",
      correctAnswer: 2
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isComplete) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitTest();
    }
  }, [timeRemaining, isComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const handleShowHint = () => {
    if (!showHint) {
      setHintsUsed(prev => new Set(prev).add(currentQuestion));
    }
    setShowHint(!showHint);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowHint(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowHint(false);
    }
  };

  const handleSubmitTest = () => {
    setIsComplete(true);
    const correctAnswers = Object.entries(selectedAnswers).filter(
      ([questionIndex, answer]) => questions[parseInt(questionIndex)].correctAnswer === answer
    ).length;
    
    const wrongAnswers = Object.keys(selectedAnswers).length - correctAnswers;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 70;
    
    const results = {
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(selectedAnswers).length,
      correctAnswers,
      wrongAnswers,
      hintsUsed: hintsUsed.size,
      timeUsed: (timeFrame * 60) - timeRemaining,
      totalTime: timeFrame * 60,
      score,
      passed
    };
    
    onComplete(results, questions);
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <Card className="bg-white border-gray-200 max-w-2xl w-full animate-fade-in shadow-lg">
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-gray-800 text-2xl">Test Completed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">Processing your results...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Exit Test
          </Button>
          
          <div className="flex items-center gap-4 text-gray-800">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-mono">{formatTime(timeRemaining)}</span>
            </div>
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border-gray-200 animate-fade-in shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800 text-xl">
                {currentQuestionData.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Options */}
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-500 hover:bg-gray-50'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-400'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-800 text-lg">{option}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hint */}
              <div className="border-t border-gray-200 pt-6">
                <Button
                  onClick={handleShowHint}
                  variant="ghost"
                  className={`transition-all duration-300 ${
                    hintsUsed.has(currentQuestion)
                      ? 'text-purple-600 hover:text-purple-700'
                      : 'text-purple-500 hover:text-purple-600'
                  } hover:bg-purple-50`}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                  {hintsUsed.has(currentQuestion) && <span className="ml-2 text-xs">(Used)</span>}
                </Button>
                {showHint && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg animate-fade-in">
                    <p className="text-purple-700">{currentQuestionData.hint}</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentQuestion
                          ? 'bg-purple-500 scale-110'
                          : selectedAnswers[index] !== undefined
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitTest}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MCQTest;
