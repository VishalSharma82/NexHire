// import OpenAI from 'openai';

// Mock responses moved to backend for consistent fallback

export const getAIResponse = async (input, config = {}) => {
  // Priority: 1. .env key (System), 2. Manual config key (Legacy)
  const { 
    category = "frontend", 
    mode = "coach", 
    resume = "", 
    persona = "supportive",
    openaiKey = "",
    geminiKey = ""
  } = config;

  // Real Backend Proxy Call
  try {
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    
    const systemPrompt = mode === 'normal' 
      ? `You are NexHire AI, a helpful and professional general-purpose assistant. 
         CURRENT DATE: ${currentDate}
         Provide insightful, accurate, and concise answers to any user query. 
         Maintain a professional but friendly tone. 
         You have access to current ongoing events—answer based on your knowledge base while respecting the current date.`
      : `
      You are an expert AI Interview Coach and Professional Analyst (NexHire Elite).
      CURRENT DATE: ${currentDate}
      Current Mode: ${mode}
      Specialty: ${category || 'General Software Engineering'}
      Persona: ${persona}
      
      ${resume ? `Candidate Resume Context: ${resume.substring(0, 2000)}` : "No resume provided yet."}

      INSTRUCTIONS:
      1. If you provide code solutions, wrap them in :::code-sync blocks.
      2. If the user asks for an interview based on their resume, START the interview immediately.
      3. Focus on real-world industry patterns, not just academic ones.
      4. Avoid being strictly frontend-focused unless explicitly asked or implied by the resume/category.
      Requirements:
      1. Use Markdown for all formatting.
      2. If the user shares a long story or project history, ANALYZE it professionally. 
      3. Identify their skills, roles, and potential value based on their narrative.
    `;
    
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input }
        ],
        temperature: 0.7,
        config: { category },
        openaiKey,
        geminiKey
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get AI response from server");
    }

    const completion = await response.json();
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error(error.message || "Failed to get AI response");
  }
};

export const getSpeechResponse = async (text) => {
  try {
    const response = await fetch('http://localhost:5000/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice: "alloy",
        model: "tts-1",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get TTS response from server");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};
