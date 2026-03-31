import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || '';

const getAi = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('GEMINI_API_KEY no configurada');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getChatbotResponse = async (userMessage: string, products: Product[]) => {
  try {
    const ai = getAi();
    if (!ai) {
      return "El servicio de IA no está disponible. Por favor contacta al administrador.";
    }
    
    const model = "gemini-2.0-flash";
    
    const productContext = products.map(p => ({
      name: p.name,
      price: p.price,
      description: p.description,
      category: p.category,
      stock: p.stock,
    }));

    const systemInstruction = `
      Eres un asistente virtual para "Jeancol Professional".
      Dispones de estos productos: ${JSON.stringify(productContext)}
      Responde de manera amable y profesional en español.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: userMessage,
      config: { systemInstruction },
    });

    return response.text;
  } catch (error) {
    console.error("Error in chatbot service:", error);
    return "Lo siento, estoy having problemas. ¿Podrías intentarlo más tarde?";
  }
};