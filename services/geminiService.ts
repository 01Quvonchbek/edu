
import { GoogleGenAI, Type } from "@google/genai";

// Fix Gemini SDK usage based on guidelines for better reliability and performance
export const generateCourseOutline = async (title: string, category: string) => {
  // Always initialize GoogleGenAI with a named parameter apiKey from process.env.API_KEY
  // Create a new instance right before making an API call to ensure it uses the latest configuration
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

    // Extracting Text Output from GenerateContentResponse: use .text property directly
    const text = response.text;
    if (!text) throw new Error("AI javob bera olmadi.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw error;
  }
};
