
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface QuestionType {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionProps {
  question: QuestionType;
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
}

const Question: React.FC<QuestionProps> = ({ question, selectedAnswer, onAnswerSelect }) => {
  return (
    <Card className="bg-white/90 backdrop-blur-md shadow-xl border border-white/50 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 mb-4">
          Question {question.id}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
          {question.text}
        </h2>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === option && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Question;
