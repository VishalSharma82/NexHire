import { useState, useRef } from 'react';
import { Send, Sparkles, Languages, ChevronDown, Paperclip, FileText, UserCircle } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set up PDF worker using Vite's asset URL
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const InputBox = ({ onSend, loading, onCategoryChange, category }) => {
  const [input, setInput] = useState('');
  const [stagedFile, setStagedFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef(null);
  const { mode, toggleMode, persona, setPersona, setResume } = useInterview();

  const extractPdfText = async (arrayBuffer) => {
    try {
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(s => s.str).join(' ') + '\n';
      }
      return fullText;
    } catch (err) {
      console.error('PDF extraction error:', err);
      return '';
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setStagedFile(file);
  };

  const processAndSend = async (textInput) => {
    if (!stagedFile) {
      onSend(textInput);
      return;
    }

    setIsParsing(true);
    const fileReader = new FileReader();
    const fileName = stagedFile.name.toLowerCase();

    const completeSend = (content) => {
      setResume(content);
      onSend(textInput || `I've uploaded my resume ${stagedFile.name}. Please analyze it or start an interview.`, content);
      setStagedFile(null);
      setIsParsing(false);
    };

    if (fileName.endsWith('.pdf')) {
      fileReader.onload = async (event) => {
        const text = await extractPdfText(event.target.result);
        completeSend(text);
      };
      fileReader.readAsArrayBuffer(stagedFile);
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      fileReader.onload = async (event) => {
        const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
        completeSend(result.value);
      };
      fileReader.readAsArrayBuffer(stagedFile);
    } else {
      fileReader.onload = (event) => {
        completeSend(event.target.result);
      };
      fileReader.readAsText(stagedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((input.trim() || stagedFile) && !loading && !isParsing) {
      processAndSend(input);
      setInput('');
    }
  };

  const getModeStyles = () => {
    if (mode === 'interviewer') return 'bg-accent/10 text-accent border-accent/20 shadow-glow-emerald/10';
    if (mode === 'coach') return 'bg-primary/10 text-primary border-primary/20 shadow-glow-blue/10';
    return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  };

  return (
    <div className="glass-card rounded-[1.8rem] sm:rounded-[2.5rem] p-2 sm:p-3 shadow-2xl relative border border-white/5 group transition-all duration-500 hover:border-white/10 hover:shadow-glow-blue/10">

      <div className="flex items-center justify-between mb-3 px-3">
        <div className="flex gap-2.5">
          <button
            onClick={toggleMode}
            className={`text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-xl transition-all flex items-center gap-2 border ${getModeStyles()} hover:scale-105 active:scale-95`}
          >
            {mode === 'interviewer' && <Sparkles size={10} className="animate-pulse" />}
            {mode === 'coach' && <UserCircle size={10} />}
            {mode === 'normal' && <Languages size={10} />}
            {mode === 'interviewer' ? 'Simulation' : mode === 'coach' ? 'Coach Mode' : 'Normal Chat'}
          </button>
        </div>

        {stagedFile && (
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-bottom-2">
            <FileText size={10} className="text-primary" />
            <span className="text-[8px] font-bold text-white truncate max-w-[100px]">{stagedFile.name}</span>
            <button 
              onClick={() => setStagedFile(null)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-2 h-2 text-gray-500 hover:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-1">
        <div className="flex flex-shrink-0">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept=".pdf,.docx,.doc,.txt,.md"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 sm:p-4 transition-colors ${stagedFile ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
            title="Upload Resume (.pdf, .docx, .txt)"
          >
            <Paperclip size={18} className="sm:w-5 sm:h-5 w-4 h-4" />
          </button>

        </div>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || isParsing}
            placeholder={isParsing ? "Parsing document..." : loading ? "Analyzing..." : mode === 'normal' ? "What's on your mind?" : "Ask your question or explain your solution..."}
            className="w-full bg-black/20 text-gray-100 border border-transparent rounded-[1.5rem] sm:rounded-[1.8rem] px-4 sm:px-8 py-3 sm:py-5 focus:outline-none focus:bg-black/40 transition-all disabled:opacity-50 text-xs sm:text-sm font-medium tracking-tight placeholder-gray-600"

          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading || isParsing || (!input.trim() && !stagedFile)}
            className="bg-primary hover:bg-blue-600 disabled:bg-gray-800 disabled:opacity-30 text-white w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-[1rem] sm:rounded-[1.5rem] transition-all duration-500 shadow-xl shadow-primary/20 hover:shadow-glow-blue/30 active:scale-90 group"

          >
            {isParsing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={20} className={`transition-all duration-500 ${input && !loading ? 'group-hover:translate-x-1 group-hover:-translate-y-1' : ''}`} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputBox;
