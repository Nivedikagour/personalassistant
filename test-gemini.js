import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("NO API KEY FOUND IN ENV");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function test() {
  try {
    console.log("Testing API Key...");
    const result = await model.generateContent("Say hello");
    console.log("SUCCESS! Response:", result.response.text());
  } catch (error) {
    console.error("API ERROR:", error.message);
  }
}

test();
