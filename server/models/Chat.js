import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  messages: [{
    text: String,
    type: { type: String, enum: ['user', 'bot'] },
    timestamp: String
  }],
  userIdentifier: { type: String, default: 'anonymous' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Chat', ChatSchema);
