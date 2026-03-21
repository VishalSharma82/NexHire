import { motion } from 'framer-motion';

import { Terminal, Award, MessageCircle, HelpCircle, User } from 'lucide-react';

const SuggestionChips = ({ onSelect }) => {
  const suggestions = [
    { label: "Top React Questions", icon: <Terminal size={14} />, color: "border-primary/30 text-primary-light" },
    { label: "Practice DSA", icon: <Award size={14} />, color: "border-accent/30 text-accent" },
    { label: "Tell me about yourself", icon: <User size={14} />, color: "border-purple-500/30 text-purple-400" },
    { label: "HR Tips", icon: <MessageCircle size={14} />, color: "border-orange-500/30 text-orange-400" },
    { label: "System Design basics", icon: <HelpCircle size={14} />, color: "border-blue-400/30 text-blue-300" }
  ];

  return (
    <div className="flex flex-wrap gap-2.5 mb-2 px-1">
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(suggestion.label)}
          className={`flex items-center gap-2 px-3.5 py-2 bg-[#1e293b]/60 text-[11px] font-medium rounded-lg border hover:bg-[#1e293b] transition-all duration-300 backdrop-blur-sm shadow-sm ${suggestion.color} hover:shadow-md hover:scale-105 active:scale-95`}
        >
          {suggestion.icon}
          {suggestion.label}
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestionChips;
