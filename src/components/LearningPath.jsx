import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, ChevronRight, CheckCircle2, Circle, X } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';

const LearningPath = ({ isOpen, onClose, onStartTraining }) => {
  const { roadmap } = useInterview();

  const paths = [
    {
      title: "Frontend Mastery",
      steps: ["React Fundamentals", "Hooks & State", "Performance Tuning"],
      id: "frontend"
    },
    {
      title: "Algorithms & DSA",
      steps: ["Arrays & Objects", "Recursion", "Dynamic Programming"],
      id: "dsa"
    },
    {
      title: "System Design",
      steps: ["Scalability", "Caching Strategies", "Load Balancing"],
      id: "system"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-[#0f172a] border border-[#1e293b] rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Map className="text-primary w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Learning Roadmap</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paths.map((path, idx) => (
                <div key={idx} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Map size={80} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-4 group-hover:text-primary transition-colors">{path.title}</h3>
                  <div className="space-y-4">
                    {path.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-3 text-sm text-gray-400">
                        {roadmap.includes(step) ? <CheckCircle2 className="text-emerald-500 shrink-0" size={16} /> : <Circle className="text-gray-600 shrink-0" size={16} />}
                        <span className={roadmap.includes(step) ? 'text-gray-200 line-through' : ''}>{step}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => onStartTraining(path.title)}
                    className="mt-8 w-full py-2 bg-[#0f172a] hover:bg-primary transition-all text-xs font-bold uppercase tracking-widest rounded-xl text-gray-400 hover:text-white border border-[#334155]"
                  >
                    Start Training
                  </button>
                </div>
              ))}
            </div>

            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
              <X />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LearningPath;
