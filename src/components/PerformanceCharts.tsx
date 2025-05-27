
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface PerformanceChartsProps {
  results: {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    hintsUsed: number;
    timeUsed: number;
    totalTime: number;
  };
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ results }) => {
  const accuracy = results.answeredQuestions > 0 ? (results.correctAnswers / results.answeredQuestions * 100) : 0;
  const timeEfficiency = (results.timeUsed / results.totalTime * 100);
  const hintUsageRate = results.totalQuestions > 0 ? (results.hintsUsed / results.totalQuestions * 100) : 0;

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
  );
};

export default PerformanceCharts;
