import MessageBubble from './MessageBubble';
import { motion } from 'framer-motion';

import { Brain, Code, Target } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

const ChatBox = ({ messages, loading }) => {
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  if (messages.length === 0) {
    return null; // Home.jsx handles the empty state now
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 md:p-8 chat-scrollbar flex flex-col bg-transparent relative min-h-0"
    >
      <div className="flex flex-col gap-2 min-h-full">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 mb-10"
          >
            <div className="glass-card px-6 py-5 rounded-3xl rounded-tl-none shadow-xl border border-white/5">
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} className="h-4 w-full flex-shrink-0" />
      </div>
    </div>
  );
};

export default ChatBox;
