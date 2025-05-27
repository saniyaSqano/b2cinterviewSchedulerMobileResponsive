import React, { useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import AssessmentFlow from '../components/AssessmentFlow';
import ChatFlow from '../components/ChatFlow';
import Level3Flow from '../components/Level3Flow';
import Level4Flow from '../components/Level4Flow';
import Level5Flow from '../components/Level5Flow';
import LearningCard from '../components/LearningCard';

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLevel3, setShowLevel3] = useState(false);
  const [showLevel4, setShowLevel4] = useState(false);
  const [showLevel5, setShowLevel5] = useState(false);
  const [assessmentScore] = useState(70);

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
      description: "Demonstrate your newly acquired skills in an AI-proctored interview environment",
      icon: 'user' as const
    },
    {
      title: "GameOn",
      subtitle: "Level 6",
      description: "Compete with others and showcase your skills in gamified challenges and competitions",
      icon: 'graduation-cap' as const
    }
  ];

  const handleCardClick = (index: number) => {
    // For testing: allow access to all levels
    console.log(`Starting ${learningSteps[index].title}`);
    
    if (index === 0) {
      setShowAssessment(true);
      return;
    }
    
    if (index === 1) {
      setShowChat(true);
      return;
    }

    if (index === 2) {
      setShowLevel3(true);
      return;
    }

    if (index === 3) {
      setShowLevel4(true);
      return;
    }

    if (index === 4) {
      setShowLevel5(true);
      return;
    }

    if (index === 5) {
      // GameOn - placeholder for now
      console.log('GameOn feature coming soon!');
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
  };

  const handleTestPassed = () => {
    if (!completedLevels.includes(0)) {
      setCompletedLevels(prev => [...prev, 0]);
      setCurrentLevel(1);
    }
  };

  const handleChatCompleted = () => {
    if (!completedLevels.includes(1)) {
      setCompletedLevels(prev => [...prev, 1]);
      setCurrentLevel(2);
    }
  };

  const handleLevel3Completed = () => {
    if (!completedLevels.includes(2)) {
      setCompletedLevels(prev => [...prev, 2]);
      setCurrentLevel(3);
    }
  };

  const handleLevel4Completed = () => {
    if (!completedLevels.includes(3)) {
      setCompletedLevels(prev => [...prev, 3]);
      setCurrentLevel(4);
    }
  };

  const handleLevel5Completed = () => {
    if (!completedLevels.includes(4)) {
      setCompletedLevels(prev => [...prev, 4]);
      // All levels completed
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

  if (showChat) {
    return (
      <ChatFlow 
        onBack={() => {
          setShowChat(false);
          handleChatCompleted();
        }}
        userName="Revati"
        assessmentScore={assessmentScore}
      />
    );
  }

  if (showLevel3) {
    return (
      <Level3Flow 
        onBack={() => {
          setShowLevel3(false);
          handleLevel3Completed();
        }}
        userName="Revati"
      />
    );
  }

  if (showLevel4) {
    return (
      <Level4Flow 
        onBack={() => {
          setShowLevel4(false);
          handleLevel4Completed();
        }}
        userName="Revati"
      />
    );
  }

  if (showLevel5) {
    return (
      <Level5Flow 
        onBack={() => {
          setShowLevel5(false);
          handleLevel5Completed();
        }}
        userName="Revati"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-md text-center pt-6 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Start your Proctor Journey
          </h1>
          <p className="text-base text-gray-700 max-w-2xl mx-auto mb-4">
            Master your skills through our comprehensive learning platform
          </p>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningSteps.map((step, index) => (
                <LearningCard
                  key={index}
                  title={step.title}
                  subtitle={step.subtitle}
                  description={step.description}
                  icon={step.icon}
                  isCompleted={completedLevels.includes(index)}
                  isActive={index === currentLevel}
                  onClick={() => handleCardClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
