
import React, { useState } from 'react';
import LearningCard from '../components/LearningCard';
import ParticleBackground from '../components/ParticleBackground';
import AssessmentFlow from '../components/AssessmentFlow';

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);

  const learningSteps = [
    {
      title: "Assessment",
      subtitle: "Level 1",
      description: "Take our comprehensive assessment to evaluate your current skills and identify areas for improvement",
      icon: 'graduation-cap' as const
    },
    {
      title: "Pitch Yourself",
      subtitle: "Level 2", 
      description: "Learn to create compelling personal pitches and develop your professional presentation skills",
      icon: 'user' as const
    },
    {
      title: "Self Practice",
      subtitle: "Level 3",
      description: "Practice your skills with interactive exercises and real-world scenarios at your own pace",
      icon: 'graduation-cap' as const
    },
    {
      title: "AI Proctored Interview",
      subtitle: "Level 4",
      description: "Complete your journey with an AI-proctored interview to demonstrate your newly acquired skills",
      icon: 'user' as const
    }
  ];

  const handleCardClick = (index: number) => {
    if (index <= currentLevel) {
      console.log(`Starting ${learningSteps[index].title}`);
      
      if (index === 0) {
        setShowAssessment(true);
        return;
      }
      
      // Simulate completion after 2 seconds for other levels
      setTimeout(() => {
        if (!completedLevels.includes(index)) {
          setCompletedLevels(prev => [...prev, index]);
          if (index === currentLevel && currentLevel < learningSteps.length - 1) {
            setCurrentLevel(prev => prev + 1);
          }
        }
      }, 2000);
    }
  };

  const handleTestPassed = () => {
    // Mark assessment as completed and unlock next level
    if (!completedLevels.includes(0)) {
      setCompletedLevels(prev => [...prev, 0]);
      setCurrentLevel(1); // Unlock Level 2
    }
  };

  if (showAssessment) {
    return (
      <AssessmentFlow 
        onBack={() => setShowAssessment(false)}
        onTestPassed={handleTestPassed}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Start your Proctor Journey
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master your skills through our comprehensive learning platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {learningSteps.map((step, index) => (
            <div key={step.title} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
              <LearningCard
                title={step.title}
                subtitle={step.subtitle}
                description={step.description}
                icon={step.icon}
                isActive={index === currentLevel}
                isCompleted={completedLevels.includes(index)}
                onClick={() => handleCardClick(index)}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="flex justify-center space-x-3 mb-6">
            {learningSteps.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  completedLevels.includes(index)
                    ? 'bg-green-500 shadow-lg'
                    : index === currentLevel
                    ? 'bg-blue-500 shadow-lg'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600 text-sm">
            Progress: {completedLevels.length} of {learningSteps.length} levels completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
