import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Plus, Trash2, History, Layout, Settings, LogOut, GraduationCap, Trophy, FileText, Key as KeyIcon, Code as CodeIcon, Map } from 'lucide-react';
import ChatBox from '../components/ChatBox';
import InputBox from '../components/InputBox';
import SuggestionChips from '../components/SuggestionChips';
import KeySettings from '../components/KeySettings';
import ResumeUploader from '../components/ResumeUploader';
import InterviewTimer from '../components/InterviewTimer';

import FeedbackCard from '../components/FeedbackCard';
import LearningPath from '../components/LearningPath';
import ProfileModal from '../components/ProfileModal';
import { getAIResponse } from '../utils/api';
import { listSessions, getSessionMessages, saveSession, deleteSession, clearAllData } from '../utils/persistence';
import { useInterview } from '../context/InterviewContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Monitor, Facebook, User, Clock, Trash } from 'lucide-react';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("frontend");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const { stats, incrementQuestions, mode, resume, persona } = useInterview();
  const { theme, setTheme } = useTheme();
  const { user, loading: authLoading, signInWithGoogle, signUp, signInWithPassword, signOut } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    
    try {
      if (isSignUp) {
        if (authForm.password !== authForm.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await signUp(authForm.email, authForm.password, authForm.name);
        alert("Registration successful! Please check your email for confirmation (if enabled) or sign in.");
        setIsSignUp(false);
      } else {
        await signInWithPassword(authForm.email, authForm.password);
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    if (user) {
      const data = await listSessions(user.id);
      setSessions(data);
    }
  };

  // Load session list on mount/user change
  useEffect(() => {
    loadSessions();
  }, [user]);

  // Handle auto-saving messages to current session
  useEffect(() => {
    const autoSave = async () => {
      if (user && messages.length > 0) {
        // Only save if it's a new message
        const newSessionId = await saveSession(user.id, currentSessionId, messages);
        if (!currentSessionId && newSessionId) {
          setCurrentSessionId(newSessionId);
          loadSessions(); // Refresh list to show new session
        }
      }
    };
    
    const timeout = setTimeout(autoSave, 1000); // Debounce save
    return () => clearTimeout(timeout);
  }, [messages, user, currentSessionId]);

  const loadSession = async (id) => {
    setLoading(true);
    const msgs = await getSessionMessages(user.id, id);
    setMessages(msgs);
    setCurrentSessionId(id);
    setLoading(false);
    setIsSidebarOpen(false);
  };

  const startNewInterview = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setIsSidebarOpen(false);
  };

  const addMessage = (text, type) => {
    const newMessage = {
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async (input, overrideResume = null) => {
    if (!user) return;
    addMessage(input, 'user');
    setLoading(true);

    try {
      const response = await getAIResponse(input, {
        category,
        mode,
        resume: overrideResume || resume,
        persona
      });
      const cleanMessage = response.replace(/:::code-sync[\s\S]*?:::/g, '').trim();
      addMessage(cleanMessage, 'bot');
      incrementQuestions();
    } catch {
      addMessage("### Oops! Something went wrong.\n\nPlease try again later. The connection to the AI Coach might be unstable.", 'bot');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (window.confirm("Are you sure you want to clear your entire chat history?")) {
      await clearAllData(user?.id);
      setMessages([]);
    }
  };

  const startRoadmapTraining = (topic) => {
    setIsPathModalOpen(false);
    handleSend(`I want to start training for the roadmap topic: "${topic}". Please guide me.`);
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0f1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Initializing Elite Access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0f1a] relative overflow-hidden text-gray-200">
        <div className="absolute top-0 -left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 -right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 glass-card border border-white/10 rounded-3xl z-10 mx-4 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 shadow-glow-blue border border-white/10">
              <img src="/logo.png" alt="NexHire" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase">NexHire</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-2">Professional AI Coach</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  required
                  value={authForm.name}
                  onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all text-white placeholder:text-gray-600"
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="professional@nexhire.ai"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all text-white placeholder:text-gray-600"
              />
            </div>

            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  value={authForm.confirmPassword}
                  onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all text-white placeholder:text-gray-600"
                />
              </div>
            )}

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-[10px] text-red-400 font-bold text-center leading-tight">{authError}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-black rounded-xl hover:shadow-glow-blue transition-all disabled:opacity-50 mt-2 uppercase tracking-widest text-xs"
            >
              {loading ? "Processing..." : (isSignUp ? "Create Account" : "Access Lab")}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">or continue with</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <button 
            type="button"
            onClick={signInWithGoogle}
            className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google OAuth
          </button>

          <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {isSignUp ? "Already a member?" : "New to NexHire?"}
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              {isSignUp ? "Login Here" : "Register Now"}
            </button>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans text-gray-200 bg-[#0a0f1a]">
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 -left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <ResumeUploader isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
      <LearningPath 
        isOpen={isPathModalOpen} 
        onClose={() => setIsPathModalOpen(false)} 
        onStartTraining={startRoadmapTraining}
      />

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:relative top-0 left-0 h-full w-72 glass-nav z-50 transform transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 shadow-2xl lg:shadow-none'}`}>

        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <img 
                  src="/logo.png" 
                  alt="NexHire" 
                  className="relative w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-transform duration-500 hover:scale-110" 
                />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tighter text-white leading-none uppercase italic">NexHire</h1>
                <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold mt-1 block opacity-80">Elite AI Coach</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <button 
            onClick={startNewInterview}
            className="w-full flex items-center justify-center gap-2 py-4 mb-8 bg-primary/20 border border-primary/30 rounded-2xl text-white font-black hover:bg-primary/30 transition-all group shadow-glow-blue/10"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            New Interview
          </button>

          <nav className="flex-1 flex flex-col min-h-0">
            {/* Fixed Modules Section - No Scroll */}
            <div className="flex-shrink-0 mb-8 pr-2">
              <div className="sidebar-label flex items-center gap-2 mb-4">
                <Layout size={12} className="text-gray-500" />
                <span>Training Lab</span>
              </div>
              <div className="space-y-2">
                <button onClick={() => setIsResumeModalOpen(true)} className="sidebar-btn font-bold">
                  <FileText size={16} className="text-accent" />
                  <span>Personalize (Resume)</span>
                </button>
                <button onClick={() => setIsPathModalOpen(true)} className="sidebar-btn font-bold">
                  <Map size={16} className="text-primary/70" />
                  <span>Career Roadmaps</span>
                </button>
              </div>
            </div>

            {/* Scrollable History Section */}
            <div className="flex-1 overflow-y-auto chat-scrollbar pr-2 min-h-0">
              <div className="sidebar-label flex items-center gap-2 mb-4">
                <Clock size={12} className="text-gray-500" />
                <span>Recent Interviews</span>
              </div>
              <div className="space-y-1 pb-4">
                {sessions.length === 0 ? (
                  <div className="px-4 py-8 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">No history yet</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <button 
                      key={session.id}
                      onClick={() => loadSession(session.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all border group ${currentSessionId === session.id ? 'bg-primary/20 border-primary/30 text-white' : 'border-transparent text-gray-500 hover:bg-white/5'}`}
                    >
                      <History size={14} className={currentSessionId === session.id ? 'text-primary' : 'text-gray-600'} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold truncate leading-none mb-1">{session.title}</p>
                        <p className="text-[8px] text-gray-600 font-medium">
                          {new Date(session.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Trash 
                        size={12} 
                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all p-0.5 hover:bg-red-500/10 rounded" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this session?")) {
                            deleteSession(user.id, session.id);
                            loadSessions();
                            if (currentSessionId === session.id) startNewInterview();
                          }
                        }}
                      />
                    </button>
                  ))
                )}
              </div>
            </div>
          </nav>

          <div className="pt-6 border-t border-white/5 mt-auto">
            <div 
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-3 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5 cursor-pointer hover:bg-white/10 transition-all group"
            >
              <div className="relative">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="User" className="w-9 h-9 rounded-xl border border-primary/20" />
                ) : (
                  <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center text-xs font-black text-primary border border-primary/30 uppercase">
                    {user?.email?.[0]}
                  </div>
                )}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0a0f1a] rounded-full shadow-glow-emerald" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-white truncate leading-none mb-1">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{mode} Coach</p>
                </div>
              </div>
              <Settings size={14} className="text-gray-600 group-hover:text-primary transition-colors" />
            </div>
            
            <button 
              onClick={signOut}
              className="w-full mt-3 py-3 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={12} />
              Terminate Session
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0f1a]/50 backdrop-blur-sm relative">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="lg:hidden absolute top-4 left-4 z-40 p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 backdrop-blur-md"
        >
          <Menu size={20} />
        </button>

        <div className="flex-1 flex overflow-hidden min-h-0 relative">
          <div className={`flex-1 flex flex-col min-h-0 transition-all duration-500 w-full`}>
            <div className="flex-1 overflow-hidden relative min-h-0 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto overflow-y-auto">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-glow-blue/20">
                    <img src="/logo.png" alt="NexHire" className="w-12 h-12 object-contain drop-shadow-xl" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white mb-2 uppercase tracking-tight">Master Your Career</h1>

                  <p className="text-[9px] sm:text-[10px] text-gray-500 mb-8 max-w-sm mx-auto font-bold uppercase tracking-widest leading-loose px-4">

                    Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Professional'}. Practice high-stakes coding or behavioral rounds with real-time feedback.
                  </p>
                  
                  <div className="w-full space-y-4">
                    <div className="sidebar-label text-center">Ready to start?</div>
                    <SuggestionChips onSelect={handleSend} />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0 relative">
                  <ChatBox messages={messages} loading={loading} />
                  
                  {showFeedback && (
                    <div className="absolute top-4 left-4 right-4 z-20 max-w-xl mx-auto">
                      <FeedbackCard 
                        score={stats.questionsAnswered > 0 ? (stats.questionsAnswered >= 5 ? 9.2 : 7.5) : 0} 
                        strengths={stats.questionsAnswered > 0 ? ["Consistent Practice"] : ["Ready"]} 
                        improvements={stats.questionsAnswered > 0 ? ["Add more metrics"] : ["Start session"]} 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 pb-4 sm:pb-8 flex-shrink-0">

              <InputBox 
                onSend={handleSend} 
                loading={loading} 
                category={category} 
                onCategoryChange={setCategory} 
              />
            </div>
          </div>
        </div>
      </main>

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        mode={mode}
        stats={stats}
      />
    </div>
  );
};

export default Home;

