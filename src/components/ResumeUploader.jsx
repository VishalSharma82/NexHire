import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, X, CheckCircle, AlertCircle, Loader2, Save } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { extractTextFromFile } from '../utils/documentParser';

const ResumeUploader = ({ isOpen, onClose }) => {
  const { resume, setResume } = useInterview();
  const [tempResume, setTempResume] = useState(resume || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Sync tempResume with context when context changes or modal opens
  React.useEffect(() => {
    setTempResume(resume || '');
  }, [resume, isOpen]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const text = await extractTextFromFile(file);
      setTempResume(text);
      setResume(text);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to parse document');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setResume(tempResume);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-3xl p-8 shadow-2xl glass"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <FileText className="text-primary w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-main)]">Resumé Context</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-dim)]">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--glass-border)] hover:border-primary/50 rounded-2xl p-6 transition-all cursor-pointer group">
                {loading ? (
                  <Loader2 className="animate-spin text-primary mb-2" size={24} />
                ) : (
                  <Upload className="text-[var(--text-muted)] group-hover:text-primary mb-2" size={24} />
                )}
                <span className="text-xs font-bold text-[var(--text-main)]">Upload Document</span>
                <span className="text-[10px] text-[var(--text-dim)] mt-1">PDF, DOCX, TXT</span>
                <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} disabled={loading} />
              </label>

              <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-[var(--text-main)] mb-1">Status</div>
                {success ? (
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
                    <CheckCircle size={14} /> Ready for AI
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                    <AlertCircle size={14} /> {error}
                  </div>
                ) : (
                  <div className="text-[10px] text-[var(--text-dim)]">Waiting for input...</div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">Resumé Content</span>
                <span className="text-[10px] text-[var(--text-dim)]">{tempResume.length} characters</span>
              </div>
              <textarea
                value={tempResume}
                onChange={(e) => setTempResume(e.target.value)}
                placeholder="Paste your experience or upload a file..."
                className="w-full h-48 bg-[var(--input-bg)] text-[var(--text-main)] border border-[var(--glass-border)] rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all text-sm resize-none chat-scrollbar"
              />

              <button
                onClick={handleSave}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Context
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResumeUploader;
