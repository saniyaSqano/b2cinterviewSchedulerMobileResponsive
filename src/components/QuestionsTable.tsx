
import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  hint: string;
  correctAnswer: number;
}

interface QuestionsTableProps {
  questions: MCQQuestion[];
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({ questions }) => {
  console.log('QuestionsTable received questions:', questions);
  
  if (!questions || questions.length === 0) {
    return (
      <Card className="bg-white border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '900ms' }}>
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Questions & Correct Answers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No questions data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '900ms' }}>
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Questions & Correct Answers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Q#</TableHead>
              <TableHead>Question</TableHead>
              <TableHead className="w-48">Correct Answer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question, index) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="text-gray-700">{question.question}</TableCell>
                <TableCell className="text-green-600 font-medium">
                  {question.options[question.correctAnswer]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default QuestionsTable;
