
// @ts-ignore
import { GoogleGenAI, Type } from "@google/genai";

// TypeScript build vaqtida process.env ni tanishi uchun:
declare const process: any;

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  return new GoogleGenAI({ apiKey });
};

export const generateCourseOutline = async (title: string, category: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Siz professional ta'lim kuratori va metodistisiz. "${title}" nomli "${category}" yo'nalishidagi o'quv kursi uchun 6 ta bo'limdan iborat batafsil o'quv rejasini (syllabus) o'zbek tilida tuzing. Javobni faqat JSON formatida qaytaring.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            outline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  chapter: { type: Type.STRING, description: "Mavzu nomi" },
                  description: { type: Type.STRING, description: "Mavzu mazmuni" }
                },
                required: ["chapter", "description"]
              }
            }
          },
          required: ["outline"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI javob bera olmadi.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw error;
  }
};
