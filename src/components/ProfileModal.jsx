import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Calendar, Award, Trophy, Target, Edit2, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileModal = ({ isOpen, onClose, user, mode, stats }) => {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.user_metadata?.full_name || '');
  const [editAvatar, setEditAvatar] = useState(user?.user_metadata?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ 
        full_name: editName,
        avatar_url: editAvatar 
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  }) : 'March 2026';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0d121f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header/Cover */}
          <div className="h-32 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 transition-colors z-10"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-8 pb-8">
            {/* Avatar & Basic Info */}
            <div className="relative -mt-12 mb-6 flex items-end justify-between">
              <div className="flex items-end gap-6">
                <div className="relative">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-24 h-24 rounded-2xl border-4 border-[#0d121f] shadow-2xl object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl border-4 border-[#0d121f] bg-primary/20 flex items-center justify-center text-3xl font-black text-primary shadow-2xl">
                      {user?.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-accent p-1.5 rounded-lg shadow-lg border-2 border-[#0d121f]">
                    <Shield size={14} className="text-white" />
                  </div>
                </div>
                <div className="pb-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-black text-xl w-64 focus:border-primary outline-none"
                        placeholder="Full Name"
                      />
                      <input
                        type="text"
                        value={editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 text-white/70 font-bold text-xs w-64 focus:border-primary outline-none"
                        placeholder="Profile Photo URL"
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-black text-white tracking-tight leading-none uppercase">
                      {user?.user_metadata?.full_name || 'NexHire Candidate'}
                    </h2>
                  )}
                  <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-2">
                    Elite {mode} Path
                  </p>
                </div>
              </div>

              <div className="pb-1">
                {isEditing ? (
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary px-6 py-2.5 rounded-xl text-[10px] font-black uppercase text-white hover:bg-blue-600 transition-all shadow-glow-blue/20"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase text-white/70 hover:bg-white/10 transition-all"
                  >
                    <Edit2 size={14} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Details */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Account Intelligence</h3>
                <div className="glass-card p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-300 truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-300">Joined {joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Target size={16} className="text-gray-400" />
                    <span className="text-gray-300 capitalize">{mode} Specialty</span>
                  </div>
                </div>
              </div>

              {/* Training Stats */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-2xl font-black text-white leading-none mb-1">{stats?.questionsAsked || 0}</p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Queries</p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-2xl font-black text-accent leading-none mb-1">Elite</p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Rank</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Snippet */}
            <div className="mt-8">
               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">NexHire Certifications</h3>
               <div className="flex gap-4 overflow-x-auto pb-2 chat-scrollbar">
                  <div className="flex-shrink-0 flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="p-2 bg-primary/20 rounded-lg"><Trophy size={16} className="text-primary" /></div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">DSA Master</span>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 opacity-50 grayscale">
                    <div className="p-2 bg-accent/20 rounded-lg"><Award size={16} className="text-accent" /></div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">System Architect</span>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;
