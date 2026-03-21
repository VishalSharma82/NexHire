import { supabase } from './supabase';

export const listSessions = async (userId) => {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('id, title, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('❌ Failed to list sessions:', err);
    return [];
  }
};

export const getSessionMessages = async (userId, sessionId) => {
  if (!userId || !sessionId) return [];
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('messages')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data?.messages || [];
  } catch (err) {
    console.error('❌ Failed to fetch session:', err);
    return [];
  }
};

export const saveSession = async (userId, sessionId, messages, title) => {
  if (!userId) return null;
  
  const payload = {
    user_id: userId,
    messages,
    title: title || (messages[0]?.text?.substring(0, 30) + '...') || 'New Interview',
    updated_at: new Date().toISOString()
  };

  try {
    if (sessionId) {
      const { error } = await supabase
        .from('chat_history')
        .update(payload)
        .eq('id', sessionId)
        .eq('user_id', userId);
      if (error) throw error;
      return sessionId;
    } else {
      const { data, error } = await supabase
        .from('chat_history')
        .insert([payload])
        .select('id')
        .single();
      if (error) throw error;
      return data.id;
    }
  } catch (err) {
    console.error('❌ Failed to save session:', err);
    return sessionId;
  }
};

export const deleteSession = async (userId, sessionId) => {
  if (!userId || !sessionId) return;
  try {
    await supabase.from('chat_history').delete().eq('id', sessionId).eq('user_id', userId);
  } catch (err) {
    console.error('❌ Failed to delete session:', err);
  }
};

// Legacy Fallbacks (optional cleanup)
export const saveChatHistory = saveSession;
export const getChatHistory = () => []; // Explicitly use sessions now
export const clearAllData = async (userId) => {
    if (!userId) { localStorage.clear(); return; }
    try {
        await supabase.from('chat_history').delete().eq('user_id', userId);
    } catch (err) {
        console.error('❌ Failed to clear all sessions:', err);
    }
    localStorage.clear();
};
