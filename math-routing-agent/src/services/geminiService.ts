import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import { Source } from '../types';

const SYSTEM_INSTRUCTION = `You are a world-class mathematics professor. Your goal is to help students by providing clear, concise, and simplified step-by-step solutions to their math problems. 
Imagine you are explaining this to a high school student who is finding the topic difficult.
Focus exclusively on educational content related to mathematics.
Politely decline any request that is not related to math, explaining that your purpose is to assist with mathematics.
When providing a solution, break it down into logical, easy-to-follow steps.
If a concept is complex, explain it in simpler terms before using it in the solution.`;

export const isMathQuestion = async (ai: GoogleGenAI, question: string): Promise<boolean> => {
  const prompt = `Is the following user query a mathematical question or directly related to a mathematical concept? Answer with only "yes" or "no".\n\nQuery: "${question}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const resultText = response.text.trim().toLowerCase();
    return resultText.includes('yes');
  } catch (error) {
    console.error("Guardrail check failed:", error);
    // Fail open: assume it's a math question if the guardrail fails to avoid blocking valid requests.
    return true;
  }
};

export const generateSolution = async (
  ai: GoogleGenAI,
  question: string,
  knowledgeBaseResult: string | null
): Promise<{ answer: string; sources: Source[] }> => {
  let finalPrompt = `User's question: "${question}". Provide a simplified, step-by-step solution.`;
  
  if (knowledgeBaseResult) {
    finalPrompt = `Based on the following known information, answer the user's question.
Known Information: "${knowledgeBaseResult}"
${finalPrompt}`;
  }
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: finalPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: knowledgeBaseResult ? [] : [{ googleSearch: {} }],
    },
  });

  const answer = response.text;
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

  let sources: Source[] = [];
  if (groundingMetadata?.groundingChunks) {
    sources = groundingMetadata.groundingChunks
      .map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Untitled',
      }))
      .filter(source => source.uri);
  }

  return { answer, sources };
};

export const refineSolution = async (
  ai: GoogleGenAI,
  originalQuestion: string,
  originalAnswer: string,
  feedback: string
): Promise<string> => {
  const prompt = `A student was given the following question and answer, and then provided feedback. Refine the original answer based on the feedback.

Original Question: "${originalQuestion}"

Original Answer:
"${originalAnswer}"

Student Feedback: "${feedback}"

Provide a new, refined, step-by-step solution that incorporates the feedback. If the feedback suggests the answer is wrong, provide the correct solution.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text;
};

export const extractQuestionsFromFile = async (
  ai: GoogleGenAI,
  fileContent: string
): Promise<string[]> => {
  const prompt = `From the following text, identify and extract all the mathematical questions. Present them as a JSON array of strings. If no questions are found, return an empty array. Text: """${fileContent}"""`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      },
    },
  });

  try {
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    if (result && Array.isArray(result.questions)) {
      return result.questions;
    }
    return [];
  } catch (e) {
    console.error("Failed to parse questions from model response:", e);
    return [];
  }
};
