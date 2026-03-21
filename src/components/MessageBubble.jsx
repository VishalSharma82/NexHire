import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Clock } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

const MessageBubble = ({ message }) => {
  const { text, type, timestamp } = message;
  const isBot = type === 'bot';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col gap-2 mb-8 ${isBot ? 'items-start' : 'items-end'}`}
    >
      <div className={`relative group max-w-[85%] md:max-w-[80%] transition-all duration-500 ${
        isBot 
          ? 'glass-card rounded-3xl rounded-tl-none border border-white/5 hover:border-white/10 hover:shadow-glow-blue/5' 
          : 'bg-primary text-white rounded-3xl rounded-tr-none shadow-xl shadow-primary/20 hover:shadow-glow-blue/30'
      }`}>
        <div className="px-6 py-4">
          {isBot ? (
            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5">
              <MarkdownRenderer content={text} />
            </div>
          ) : (
            <p className="text-sm font-medium leading-relaxed tracking-tight">{text}</p>
          )}
        </div>
        
        {isBot && (
          <div className="absolute top-4 -right-12 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
            <button
              onClick={handleCopy}
              className="p-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-primary transition-all shadow-xl"
              title="Copy response"
            >
              {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
      
      <div className={`flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-1 h-1 rounded-full ${isBot ? 'bg-primary' : 'bg-white/20'}`} />
        <span>{timestamp}</span>
        {isBot && <span className="text-primary/50">• AI COACH</span>}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
