
import React, { useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import AssessmentFlow from '../components/AssessmentFlow';
import InteractiveRoadmap from '../components/InteractiveRoadmap';

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
      title: "Chat with AI",
      subtitle: "Level 2", 
      description: "Engage with our AI assistant to get personalized feedback and guidance on your performance",
      icon: 'user' as const
    },
    {
      title: "Pitch Yourself",
      subtitle: "Level 3", 
      description: "Learn to create compelling personal pitches and develop your professional presentation skills",
      icon: 'user' as const
    },
    {
      title: "Self Practice",
      subtitle: "Level 4",
      description: "Practice your skills with interactive exercises and real-world scenarios at your own pace",
      icon: 'graduation-cap' as const
    },
    {
      title: "AI Proctored Interview",
      subtitle: "Level 5",
      description: "Complete your journey with an AI-proctored interview to demonstrate your newly acquired skills",
      icon: 'user' as const
    },
    {
      title: "Game on",
      subtitle: "Level 6",
      description: "Unlock exciting challenges and compete with others to showcase your mastered skills",
      icon: 'graduation-cap' as const
    }
  ];

  const handleCardClick = (index: number) => {
    // Disable the last card (Game on)
    if (index === learningSteps.length - 1) {
      return;
    }

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
      setCurrentLevel(1); // Unlock Level 2 (Chat with AI)
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10">
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Start your Proctor Journey
          </h1>
          <p className="text-base text-gray-700 max-w-2xl mx-auto mb-4">
            Master your skills through our comprehensive learning platform
          </p>
        </div>

        <InteractiveRoadmap
          currentLevel={currentLevel}
          completedLevels={completedLevels}
          onStepClick={handleCardClick}
        />
      </div>
    </div>
  );
};

export default Index;
