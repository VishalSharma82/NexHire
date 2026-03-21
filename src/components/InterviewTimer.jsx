import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, RotateCcw } from 'lucide-react';

const InterviewTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div className="flex items-center gap-3 bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-2 text-xs font-mono font-bold shadow-sm">
      <div className="flex items-center gap-2 text-gray-400">
        <div className={`p-1 rounded ${isActive ? 'bg-accent/20 text-accent animate-pulse' : 'bg-gray-800'}`}>
          <Timer size={14} />
        </div>
        <span className={isActive ? 'text-white' : ''}>{formatTime(seconds)}</span>
      </div>
      
      <div className="h-4 w-px bg-[#334155]" />
      
      <div className="flex gap-2">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-2 py-0.5 rounded transition-all ${
            isActive ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-accent/10 text-accent hover:bg-accent/20'
          }`}
        >
          {isActive ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="text-gray-500 hover:text-white transition-colors"
          title="Reset Timer"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};

export default InterviewTimer;
