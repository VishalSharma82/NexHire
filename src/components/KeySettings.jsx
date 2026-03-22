import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, X, Check, AlertCircle } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';

const KeySettings = ({ isOpen, onClose }) => {
  const { openaiKey, setOpenaiKey, geminiKey, setGeminiKey } = useInterview();
  const [tempOpenaiKey, setTempOpenaiKey] = useState(openaiKey);
  const [tempGeminiKey, setTempGeminiKey] = useState(geminiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setOpenaiKey(tempOpenaiKey);
    setGeminiKey(tempGeminiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <Key className="text-primary w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">AI Configuration</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-500">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Enter your **API Keys** to enable real-time, context-aware interview sessions. Your keys are stored locally in your browser and never sent anywhere else.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">OpenAI API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    value={tempOpenaiKey}
                    onChange={(e) => setTempOpenaiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-[#0f172a] text-gray-100 border border-[#334155] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-mono shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Gemini API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    value={tempGeminiKey}
                    onChange={(e) => setTempGeminiKey(e.target.value)}
                    placeholder="AIza..."
                    className="w-full bg-[#0f172a] text-gray-100 border border-[#334155] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-mono shadow-inner"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3">
                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-500/90 leading-normal">
                  No API Keys? The coach will fall back to platform default keys or smart mock mode. To get keys, visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="underline font-bold">OpenAI</a> or <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-bold">Gemini</a> dashboards.
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={saved}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg ${
                  saved ? 'bg-accent text-white' : 'bg-primary hover:bg-blue-600 text-white shadow-primary/20'
                }`}
              >
                {saved ? <Check size={20} /> : 'Save Configuration'}
                {saved ? 'Settings Updated!' : ''}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default KeySettings;
