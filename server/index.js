import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Chat from './models/Chat.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
