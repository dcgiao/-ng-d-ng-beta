import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Topic, Question } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMathQuestions = async (topic: Topic, difficulty: Difficulty, count: number = 5): Promise<Question[]> => {
  const modelId = 'gemini-2.5-flash';

  const prompt = `
    You are a fun and energetic elementary school math teacher designed to create engaging content for children aged 6-11.
    
    IMPORTANT: ALL OUTPUT MUST BE IN VIETNAMESE (Tiếng Việt).
    
    Create ${count} multiple-choice math questions about "${topic}" at a "${difficulty}" level.
    
    Guidelines:
    - EASY (Dễ): Single digit numbers, visual counting logic, very simple language.
    - MEDIUM (Trung bình): Double digit numbers, simple remainders, standard equations.
    - HARD (Khó): Triple digits, multi-step logic, or slightly complex word problems suitable for 5th graders.
    - Make the "text" of the question fun. Use names of animals, fruits, or space themes if possible.
    - Provide an "explanation" that is encouraging and educational.
    - Provide a "funFact" related to numbers or the topic.
    - Ensure "options" has exactly 4 choices.
    - Ensure "correctAnswer" matches exactly one of the options.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              funFact: { type: Type.STRING }
            },
            required: ["id", "text", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }

    const questions = JSON.parse(jsonText) as Question[];
    return questions;

  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback questions in case API fails or key is missing/invalid
    return [
      {
        id: "fallback-1",
        text: "Rất tiếc! Tín hiệu vũ trụ bị nhiễu. 2 + 2 bằng mấy?",
        options: ["3", "4", "5", "22"],
        correctAnswer: "4",
        explanation: "2 cộng 2 luôn luôn bằng 4!",
        funFact: "Các con số là vô tận!"
      }
    ];
  }
};