import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import Chat from './models/Chat.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (process.env.OPENAI_API_KEY) {
  console.log('OpenAI Key Loaded: Yes (Start: ' + process.env.OPENAI_API_KEY.substring(0, 10) + '...)');
} else {
  console.log('OpenAI Key Loaded: No');
}

const mockResponses = {
  react: [
    "### React Fundamentals\n\nReact is a **declarative, component-based** library for building UIs. Here are key concepts:\n\n* **JSX**: Syntax sugar for `React.createElement`.\n* **Components**: Independent, reusable pieces of UI.\n* **Props**: How we pass data between components.\n\n```javascript\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n```",
    "### The Virtual DOM\n\nThe **Virtual DOM** is a programming concept where an 'ideal', or 'virtual', representation of a UI is kept in memory and synced with the 'real' DOM.\n\n> **Note**: This process is called **reconciliation**.",
    "### React Hooks\n\nHooks let you use state and other React features without writing a class. Some common hooks:\n\n1. `useState`: Track state in functional components.\n2. `useEffect`: Handle side effects (API calls, subscriptions).\n3. `useContext`: Access React Context.\n\n```javascript\nconst [count, setCount] = useState(0);\n```",
    "### State vs Props\n\n| Feature | Props | State |\n| :--- | :--- | :--- |\n| Read-only | Yes | No (Mutable) |\n| Ownership | Parent | Component itself |\n| Triggers re-render | Yes | Yes |"
  ],
  dsa: [
    "### Linked Lists\n\nA **Linked List** consists of nodes where each node contains data and a reference to the next node.\n\n* **Pros**: Dynamic size, easy insertion/deletion.\n* **Cons**: No random access, extra memory for pointers.\n\n```python\nclass Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n```",
    "### Binary Search\n\nBinary search find the position of a target value within a **sorted** array.\n\n**Time Complexity**: $O(\\log n)$\n\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n```"
  ],
  default: [
    "### Welcome to AI Interview Coach!\n\nI'm here to help you get that dream job. You can ask me about:\n\n*   **Technical concepts** (React, JS, CSS)\n*   **Algorithms** (DSA basics)\n*   **System Design**\n*   **HR Tips**\n\nWhat would you like to focus on today?"
  ]
};

const PORT = 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot-ai';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.get('/api/history', async (req, res) => {
  try {
    const chat = await Chat.findOne().sort({ createdAt: -1 });
    res.json(chat ? chat.messages : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const { messages } = req.body;
    let chat = await Chat.findOne().sort({ createdAt: -1 });
    
    if (chat) {
      chat.messages = messages;
      await chat.save();
    } else {
      chat = new Chat({ messages });
      await chat.save();
    }
    res.json(chat.messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/history', async (req, res) => {
  try {
    await Chat.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OpenAI Proxy Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, temperature, apiKey, config = {} } = req.body;
    
    // Choose the key: User-provided key (from frontend modal) > Server environment key
    const targetApiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!targetApiKey) {
      throw { status: 401, message: "No API key provided" };
    }

    // Create a temporary OpenAI client for this request if a custom key is provided
    const client = apiKey ? new OpenAI({ apiKey }) : openai;

    const completion = await client.chat.completions.create({
      model: model || "gpt-4o",
      messages,
      temperature: temperature || 0.7,
    });
    res.json(completion);
  } catch (err) {
    if (err.status === 401 || (err.message && err.message.includes('401')) || !process.env.OPENAI_API_KEY) {
      console.warn('OpenAI Auth Error (401) or Missing Key. Falling back to Mock responses.');
      
      const { category = "frontend" } = req.body.config || {};
      const userMessage = req.body.messages[req.body.messages.length - 1].content.toLowerCase();
      
      let categoryKey = "default";
      if (category === "frontend" || userMessage.includes("react") || userMessage.includes("js") || userMessage.includes("css")) {
        categoryKey = "react";
      } else if (category === "dsa" || userMessage.includes("algorithm") || userMessage.includes("data structure")) {
        categoryKey = "dsa";
      }

      const responses = mockResponses[categoryKey] || mockResponses.default;
      const mockText = `> **[MOCK MODE ACTIVE]** Bhai, real AI response ke liye API Key zaruri hai. Tab tak ye demo dekho:\n\n${responses[Math.floor(Math.random() * responses.length)]}`;
      
      return res.json({
        choices: [{
          message: { content: mockText }
        }]
      });
    }

    console.error('OpenAI Chat Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice, model } = req.body;
    const mp3 = await openai.audio.speech.create({
      model: model || "tts-1",
      voice: voice || "alloy",
      input: text,
    });
    
    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  } catch (err) {
    console.error('OpenAI TTS Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
