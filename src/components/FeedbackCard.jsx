import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertTriangle, Star, Check } from 'lucide-react';

const FeedbackCard = ({ score, strengths, improvements }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6 shadow-2xl mb-6 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <TrendingUp size={120} />
      </div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Star className="text-accent" size={20} fill="currentColor" />
          Performance Snapshot
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-primary">{score}</span>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">/ 10</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div className="space-y-3">
          <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-1">Top Strengths</div>
          {strengths.map((s, i) => (
            <div key={i} className="flex gap-3 text-sm text-gray-300 bg-[#0f172a] p-3 rounded-xl border border-emerald-500/20">
              <Check className="text-emerald-500 shrink-0" size={16} />
              {s}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest px-1">Growth Areas</div>
          {improvements.map((im, i) => (
            <div key={i} className="flex gap-3 text-sm text-gray-300 bg-[#0f172a] p-3 rounded-xl border border-amber-500/20">
              <AlertTriangle className="text-amber-500 shrink-0" size={16} />
              {im}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#334155] flex items-center gap-3 text-xs text-gray-400">
        <Lightbulb size={16} className="text-primary" />
        <p>AI Insight: Focus on articulating your architecture decisions more clearly.</p>
      </div>
    </motion.div>
  );
};

export default FeedbackCard;
