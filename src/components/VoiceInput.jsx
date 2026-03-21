import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceInput = ({ onTranscription }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const fullText = finalTranscript || interimTranscript;
        setTranscript(fullText);
      };

      recognition.onend = () => {
        if (isListening && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error("Failed to restart recognition:", err);
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      if (transcript) onTranscription(transcript);
      setTranscript('');
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    }
    setIsListening(!isListening);
  };

  return (
    <div className="relative flex items-center">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-12 bg-accent/20 border border-accent/30 text-accent px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap backdrop-blur-md z-50 pointer-events-none"
          >
            <Waves size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Listening...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggleListening}
        className={`p-3 rounded-xl transition-all duration-300 ${
          isListening 
            ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-glow-red' 
            : 'bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
        }`}
        title={isListening ? "Stop Listening" : "Start Voice Input"}
      >
        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
    </div>
  );
};

export default VoiceInput;
