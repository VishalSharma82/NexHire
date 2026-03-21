import React, { createContext, useContext, useState, useEffect } from 'react';

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [mode, setMode] = useState('coach'); // 'coach' or 'interviewer'
  
  // Safe initializers
  const getSafeItem = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return fallback;
      
      // If the fallback is a string, return the item directly
      if (typeof fallback === 'string') return item;
      
      // Otherwise try parsing as JSON
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error loading ${key} from localStorage:`, e);
      return fallback;
    }
  };

  const [apiKey, setApiKey] = useState(() => getSafeItem('openai_api_key', ''));
  const [resume, setResume] = useState(() => getSafeItem('user_resume', ''));
  const [persona, setPersona] = useState('supportive'); 
  const [code, setCode] = useState('// Your code here...\n\nfunction solution() {\n  return 0;\n}');
  const [language, setLanguage] = useState('javascript');
  const [achievements, setAchievements] = useState(() => getSafeItem('achievements', []));
  const [roadmap, setRoadmap] = useState(() => getSafeItem('roadmap', []));
  const [currentSession, setCurrentSession] = useState(null);
  
  const [stats, setStats] = useState(() => getSafeItem('interview_stats', {
    questionsAnswered: 0,
    streak: 0,
    lastActive: new Date().toISOString()
  }));

  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('user_resume', resume);
  }, [resume]);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('roadmap', JSON.stringify(roadmap));
  }, [roadmap]);

  useEffect(() => {
    localStorage.setItem('interview_stats', JSON.stringify(stats));
  }, [stats]);

  const toggleMode = () => {
    setMode(prev => {
      if (prev === 'coach') return 'interviewer';
      if (prev === 'interviewer') return 'normal';
      return 'coach';
    });
  };

  const addAchievement = (title) => {
    if (!achievements.includes(title)) {
      setAchievements(prev => [...prev, title]);
    }
  };

  const incrementQuestions = () => {
    setStats(prev => {
      const newCount = prev.questionsAnswered + 1;
      if (newCount === 5) addAchievement("Fast Starter");
      if (newCount === 10) addAchievement("Serious Learner");
      return {
        ...prev,
        questionsAnswered: newCount,
        lastActive: new Date().toISOString()
      };
    });
  };

  return (
    <InterviewContext.Provider value={{ 
      mode, 
      setMode, 
      toggleMode, 
      apiKey, 
      setApiKey,
      resume,
      setResume,
      persona,
      setPersona,
      code,
      setCode,
      language,
      setLanguage,
      achievements,
      addAchievement,
      roadmap,
      setRoadmap,
      currentSession, 
      setCurrentSession,
      stats,
      incrementQuestions
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
