import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Question from './Question';
import TestReport from './TestReport';
import { Button } from './ui/button';

interface QuestionType {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface AssessmentFlowProps {
  onBack: () => void;
  onTestPassed: () => void;
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onBack, onTestPassed }) => {
  const [questions, setQuestions] = useState<QuestionType[]>([
    {
      id: 1,
      text: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      correctAnswer: 'Paris',
    },
    {
      id: 2,
      text: 'Which planet is known as the "Red Planet"?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars',
    },
    {
      id: 3,
      text: 'What is the largest mammal in the world?',
      options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
      correctAnswer: 'Blue Whale',
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [score, setScore] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [totalTime, setTotalTime] = useState(600);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (timeLeft > 0 && !showReport) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowReport(true);
      calculateScore();
    }
    return () => clearInterval(intervalId);
  }, [timeLeft, showReport]);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        correctCount++;
      }
    });
    setScore(correctCount);
    onTestPassed();
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Try to get user details from localStorage
  const getUserDetails = () => {
    try {
      const storedData = localStorage.getItem('currentUserData');
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
    return null;
  };

  if (showReport) {
    return (
      <TestReport
        score={score}
        totalQuestions={questions.length}
        correctAnswers={score}
        wrongAnswers={questions.length - score}
        timeUsed={totalTime - timeLeft}
        totalTime={totalTime}
        onBack={() => {
          setShowReport(false);
          onBack();
        }}
        userDetails={getUserDetails()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">Skill Assessment</h1>
              <p className="text-sm text-gray-600">Time Remaining: {formatTime(timeLeft)}</p>
            </div>
            <div className="w-10"></div>
          </div>
          <Question
            question={questions[currentQuestionIndex]}
            selectedAnswer={answers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
          />
          <div className="flex justify-between mt-8 animate-fade-in">
            <Button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              Previous
            </Button>
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={() => {
                  calculateScore();
                  setShowReport(true);
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={goToNextQuestion}
                disabled={!answers[currentQuestionIndex]}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentFlow;
