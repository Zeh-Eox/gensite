import 'dotenv/config'
import OpenAI from 'openai';

const { AI_API_KEY, AI_API_BASE_URL } = process.env;

if (!AI_API_KEY || !AI_API_BASE_URL) {
  throw new Error("Missing AI configuration in environment variables");
}

const openAIClient: OpenAI = new OpenAI({
  baseURL: AI_API_BASE_URL,
  apiKey: AI_API_KEY,
});

export default openAIClient;