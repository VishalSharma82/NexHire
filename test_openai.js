import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    console.log('Testing key starting with:', process.env.OPENAI_API_KEY.substring(0, 10));
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "hi" }],
    });
    console.log('Success:', completion.choices[0].message.content);
  } catch (err) {
    console.error('Error Details:');
    console.error('Status:', err.status);
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Type:', err.type);
  }
}

test();
