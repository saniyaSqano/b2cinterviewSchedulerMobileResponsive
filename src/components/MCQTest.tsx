
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ParticleBackground from './ParticleBackground';

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
  onComplete: (results: any) => void;
}

const MCQTest: React.FC<MCQTestProps> = ({ totalQuestions, timeFrame, onBack, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeFrame * 60); // Convert to seconds
  const [isComplete, setIsComplete] = useState(false);

  // Sample MCQ questions - in a real app, these would come from an API
  const questions: MCQQuestion[] = Array.from({ length: totalQuestions }, (_, index) => ({
    id: index + 1,
    question: `What is the output of the following JavaScript code snippet? (Question ${index + 1})`,
    options: [
      'undefined',
      'null',
      'ReferenceError',
      '0'
    ],
    hint: 'Think about how JavaScript handles variable declarations and scope.',
    correctAnswer: 2
  }));

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
    const results = {
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(selectedAnswers).length,
      correctAnswers: Object.entries(selectedAnswers).filter(
        ([questionIndex, answer]) => questions[parseInt(questionIndex)].correctAnswer === answer
      ).length,
      timeUsed: (timeFrame * 60) - timeRemaining
    };
    onComplete(results);
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <Card className="bg-slate-900 border-slate-700 max-w-2xl w-full animate-fade-in">
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-white text-2xl">Test Completed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-300">Your test has been submitted successfully.</p>
              <Button onClick={onBack} className="bg-purple-600 hover:bg-purple-700">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Exit Test
          </Button>
          
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-mono">{formatTime(timeRemaining)}</span>
            </div>
            <div className="text-sm text-slate-400">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-900 border-slate-700 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-white text-xl">
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
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-600 hover:border-purple-500'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-slate-500'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-white text-lg">{option}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hint */}
              <div className="border-t border-slate-700 pt-6">
                <Button
                  onClick={() => setShowHint(!showHint)}
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
                {showHint && (
                  <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg animate-fade-in">
                    <p className="text-purple-300">{currentQuestionData.hint}</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-700">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="ghost"
                  className="text-slate-400 hover:text-white disabled:opacity-50"
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
                          : 'bg-slate-600'
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
