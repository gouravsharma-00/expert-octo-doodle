import { GoogleGenAI } from '@google/genai';
import type * as vscode from 'vscode';
import { SECRET_KEYS } from '../commands/configure';

function cleanJsonishText(text: string): string {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

async function getAiClient(context: vscode.ExtensionContext): Promise<GoogleGenAI> {
  const apiKey = await context.secrets.get(SECRET_KEYS.geminiApiKey);
  if (!apiKey) {
    throw new Error('Missing AI API key. Run "AI Debugger: Configure" first.');
  }
  return new GoogleGenAI({ apiKey });
}

export type AnalyzeResult = {
  bugs: Array<{
    line: number | null;
    issue: string;
    explanation: string;
    fix: string;
  }>;
  performance: string;
  security: string;
  refactored_code: string;
};

export async function analyzeCodeWithAi(
  context: vscode.ExtensionContext,
  code: string,
  language: string | undefined
): Promise<AnalyzeResult> {
  if (!code?.trim()) {
    throw new Error('Code is required');
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

  const ai = await getAiClient(context);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  const cleaned = cleanJsonishText(response.text);
  return JSON.parse(cleaned) as AnalyzeResult;
}

export type NLDebugResult = {
  problem: string;
  explanation: string;
  fixedCode: string;
};

export async function nlDebugWithAi(
  context: vscode.ExtensionContext,
  description: string,
  code: string | undefined,
  language: string | undefined
): Promise<NLDebugResult> {
  if (!description?.trim()) {
    throw new Error('Description of the problem is required.');
  }

  const prompt = `
You are an expert AI coding assistant. A user has a coding issue described below.
Language: ${language || 'Not specified'}
Issue Description: ${description}

${code ? `Here is the code context:\n\n${code}\n\n` : ''}

Identify the bug based on the description and code. Explain it simply. Fix the code.
Return exactly and ONLY a JSON response without any Markdown code blocks or additional wrapping text. The output MUST parse strictly as JSON.

Required format:
{
  "problem": "<short sentence describing what the actual problem is>",
  "explanation": "<detailed beginner-friendly explanation>",
  "fixedCode": "<the fully corrected code as a single string, or empty string if no code to fix>"
}
`;

  const ai = await getAiClient(context);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  const cleaned = cleanJsonishText(response.text);
  return JSON.parse(cleaned) as NLDebugResult;
}

export type ChatMessage = { role: 'user' | 'ai'; content: string };

export async function chatWithAi(
  context: vscode.ExtensionContext,
  messages: ChatMessage[],
  codeContext: string | undefined,
  language: string | undefined,
  hintMode: boolean | undefined
): Promise<{ reply: string }> {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages array is required');
  }

  let systemPrompt = `You are an expert coding assistant helping debug code. Be concise, clear, and helpful.`;
  if (hintMode) {
    systemPrompt += ` The user has enabled "Hint Mode". You must ONLY provide hints, concepts, pointing out errors, or guiding questions. DO NOT provide the full solution or write the corrected code for them. Let them figure it out.`;
  }
  if (codeContext) {
    systemPrompt += `\n\nContext code provided by user:\n\`\`\`${language || ''}\n${codeContext}\n\`\`\``;
  }

  const ai = await getAiClient(context);

  const aiMessages: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [
    {
      role: 'user',
      parts: [
        {
          text:
            systemPrompt +
            "\n\n(Acknowledge this system prompt internally and start answering the user's latest query below based on this persona and constraints)"
        }
      ]
    },
    { role: 'model', parts: [{ text: 'Understood. I will act as the expert coding assistant and follow the provided constraints.' }] }
  ];

  messages.forEach((msg) => {
    aiMessages.push({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  });

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: aiMessages.slice(0, aiMessages.length - 1)
  });

  const response = await chat.sendMessage({
    message: aiMessages[aiMessages.length - 1].parts[0].text
  });

  return { reply: response.text };
}

