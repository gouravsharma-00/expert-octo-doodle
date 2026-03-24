import { GoogleGenAI } from '@google/genai';
import DebugHistory from '../models/DebugHistory.js';
import dotenv from 'dotenv';
dotenv.config();

// Note: Ensure the API key is passed correctly or GOOGLE_GENAI_API_KEY is in the env.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

export const analyzeCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    const prompt = `
You are an expert AI debugging assistant. Analyze the following ${language || 'code'} snippet.
Return exactly and ONLY a JSON response without any Markdown code blocks or additional wrapping text. The output MUST parse strictly as JSON.

Required format:
{
  "bugs": [
    {
      "line": <number or null if not applicable>,
      "issue": "<short description of issue>",
      "explanation": "<detailed beginner-friendly explanation>",
      "fix": "<how to fix it>"
    }
  ],
  "performance": "<performance suggestions or 'Looks good'>",
  "security": "<security issues or 'No major issues detected'>",
  "refactored_code": "<the fully corrected and optimized code as a single string>"
}

Code to analyze:
${code}`;

    let responseJson = null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text;
      
      // Clean up markdown wrapping if the AI accidentally returned it
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      responseJson = JSON.parse(cleanedText);
      console.log('Parsed JSON from AI');
    } catch (aiError) {
      console.error('AI Generation or Parsing Error:', aiError);
      return res.status(500).json({ message: 'Failed to generate analysis from AI. Make sure GEMINI_API_KEY is correct.' });
    }

    // Save to history
    const historyRecord = await DebugHistory.create({
      userId,
      code,
      language: language || 'plaintext',
      result: responseJson
    });

    res.json(responseJson);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error analyzing code' });
  }
};
