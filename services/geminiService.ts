
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly as per guidelines
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateCourseOutline = async (title: string, category: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Ta'lim kursi uchun reja tuzib ber. Kurs nomi: "${title}", Yo'nalish: "${category}". Javobni o'zbek tilida, JSON formatida qaytar. Reja 5 ta asosiy bo'limdan iborat bo'lsin.`,
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
                chapter: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["chapter", "description"]
            }
          }
        },
        required: ["outline"]
      }
    }
  });
  
  // Directly access the .text property
  const jsonStr = response.text || '{}';
  return JSON.parse(jsonStr);
};

export const optimizeDescription = async (text: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Ushbu ta'limga oid matnni professionalroq va jozibadorroq qilib tahrirlab ber: "${text}". Faqat tahrirlangan matnning o'zini qaytar.`,
  });
  // Directly access the .text property
  return response.text;
};
