import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const hfToken = process.env.HF_ACCESS_TOKEN;

if (!hfToken) {
  console.error("CRITICAL: HF_ACCESS_TOKEN is not set in .env");
}

const hf = new HfInference(hfToken);

const HF_MODEL = "Qwen/Qwen2.5-72B-Instruct";

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, context } = req.body;
    
    // Construct the history format required by Hugging Face chat completion
    let chatHistory = [];
    
    // Inject the system context
    // Mistral supports 'system' roles in v0.3
    chatHistory.push({ role: "system", content: context });

    if (history && history.length > 0) {
      const formattedHistory = history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.text || msg.content
      }));
      chatHistory = chatHistory.concat(formattedHistory);
    }

    // Add the current user message
    chatHistory.push({ role: "user", content: message });

    console.log(`Sending request to Hugging Face API (${HF_MODEL})...`);

    const out = await hf.chatCompletion({
      model: HF_MODEL,
      messages: chatHistory,
      max_tokens: 500,
      temperature: 0.7,
    });

    if (out && out.choices && out.choices.length > 0) {
       res.json({ response: out.choices[0].message.content });
    } else {
       throw new Error("Invalid response format from Hugging Face");
    }
    
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    res.status(500).json({ error: "Failed to communicate with Hugging Face AI.", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
  console.log(`Connected to Hugging Face Inference API`);
});
