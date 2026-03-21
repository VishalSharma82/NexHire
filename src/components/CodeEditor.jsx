import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { useInterview } from '../context/InterviewContext';
import { Play, Copy, RotateCcw } from 'lucide-react';

const CodeEditor = () => {
  const { code, setCode, language } = useInterview();
  const [output, setOutput] = React.useState(null);
  const [isRunning, setIsRunning] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput(null);
    
    // Simulating code execution
    setTimeout(() => {
      setIsRunning(false);
      setOutput("✅ Code execution successful!\n\nOutput: [Done]\nStatus: Optimization Recommended");
    }, 1500);
  };

  const handleReset = () => {
    if (window.confirm("Reset code buffer?")) {
      setCode('// Your code here...\n\nfunction solution() {\n  return 0;\n}');
      setOutput(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border border-[var(--glass-border)] rounded-2xl overflow-hidden shadow-2xl relative group glass">
      <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 px-1">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
          </div>
          <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest ml-2">Coding Sandbox</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="p-1.5 text-[var(--text-dim)] hover:text-white transition-colors" title="Reset">
            <RotateCcw size={14} />
          </button>
          <button onClick={handleCopy} className="p-1.5 text-[var(--text-dim)] hover:text-white transition-colors" title="Copy">
            <Copy size={14} />
          </button>
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-blue-600 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
          >
            {isRunning ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} className="fill-current" />}
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-sm chat-scrollbar">
        <Editor
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => {
            const lang = languages.javascript || languages.js || languages.clike;
            return lang ? highlight(code, lang) : code;
          }}
          padding={10}
          className="min-h-full outline-none text-[var(--text-main)]"
          style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
          }}
        />
      </div>

      <AnimatePresence>
        {output && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-3 bg-black/60 border-t border-[var(--glass-border)] font-mono text-[10px] text-emerald-400 whitespace-pre-wrap relative"
          >
            <button onClick={() => setOutput(null)} className="absolute top-2 right-2 text-[var(--text-dim)] hover:text-white">
              <X size={12} />
            </button>
            {output}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-2 bg-black/40 border-t border-[var(--glass-border)] flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-dim)] font-bold uppercase">{language}</span>
        <span className="text-[10px] text-[var(--text-dim)] hover:text-[var(--text-main)] cursor-help transition-colors">UTF-8</span>
      </div>
    </div>
  );
};

export default CodeEditor;
