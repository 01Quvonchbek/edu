
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateCourseOutline = async (title: string, category: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Siz professional ta'lim kuratori emassiz. Quyidagi kurs uchun mukammal o'quv rejasini tuzing.
    Kurs nomi: "${title}"
    Yo'nalish: "${category}"
    Tili: O'zbek tili
    Format: JSON
    Reja kamida 5 ta bo'limdan iborat bo'lsin va har bir bo'lim uchun qisqacha tavsif bering.`,
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
                chapter: { 
                  type: Type.STRING,
                  description: "Bo'lim sarlavhasi"
                },
                description: { 
                  type: Type.STRING,
                  description: "Bo'lim haqida qisqacha ma'lumot"
                }
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
};

export const optimizeDescription = async (text: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Quyidagi ta'limga oid matnni tahrirlang, uni yanada jozibador, professional va ishonchli qiling: "${text}". Faqat tahrirlangan matnning o'zini qaytaring.`,
  });
  return response.text;
};
