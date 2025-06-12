
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import MCQTest from './MCQTest';
import TestReport from './TestReport';
import { useNavigate } from 'react-router-dom';

const MCQTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [testQuestions, setTestQuestions] = useState<any[]>([]);

  const handleBack = () => {
    navigate('/freeassessment');
  };

  const handleTestComplete = (results: any, questions: any[]) => {
    console.log('Test completed with results:', results);
    setTestResults(results);
    setTestQuestions(questions);
    setShowReport(true);
  };

  if (showReport && testResults) {
    return (
      <TestReport
        score={testResults.correctAnswers}
        totalQuestions={testResults.totalQuestions}
        correctAnswers={testResults.correctAnswers}
        wrongAnswers={testResults.wrongAnswers}
        timeUsed={testResults.timeUsed}
        totalTime={testResults.totalTime}
        onBack={handleBack}
        userDetails={null}
      />
    );
  }

  return (
    <MCQTest
      totalQuestions={3}
      timeFrame={10}
      onBack={handleBack}
      onComplete={handleTestComplete}
    />
  );
};

export default MCQTestPage;
