import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = 3001; // Use port 3001 for the backend API

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

app.post('/generate-diet-plan', async (req, res) => {
  const { height, weight, heightUnit, goal } = req.body;

  // Convert height to cm if in foot
  let heightInCm = heightUnit === 'cm' ? height : height * 30.48;

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  const prompt = `You are an experienced nutritionist in the world of bodybuilding. Provide me a ${goal} diet along with muscle building for ${weight} kg ${heightInCm} cm height in a structured table like format`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const lines = text.split('\n');
    const structuredData = lines.map(line => line.trim()).filter(line => line.length > 0);
    
    res.json({ dietPlan: structuredData });
  } catch (error) {
    console.error('Error generating diet plan:', error);
    res.status(500).json({ error: 'Failed to generate diet plan' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
