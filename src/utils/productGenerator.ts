import { GoogleGenAI } from "@google/genai";

const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || '';

const getAi = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('GEMINI_API_KEY no configurada');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAIDescription = async (productName: string, brand: string = 'JEANCOL') => {
  try {
    const ai = getAi();
    if (!ai) return '';
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Genera descripción persuasiva para "${productName}" marca "${brand}". Máximo 150 palabras.`,
    });
    return response.text || '';
  } catch (err) {
    console.error('Error generating AI description:', err);
    return '';
  }
};

export const generateAIFeatures = async (productName: string, category: string) => {
  try {
    const ai = getAi();
    if (!ai) return [];
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Genera 5 características para "${productName}" categoría "${category}". Separadas por saltos de línea.`,
    });
    return response.text?.split('\n').filter(line => line.trim()) || [];
  } catch (err) {
    console.error('Error generating AI features:', err);
    return [];
  }
};

export const generateVariations = async (productName: string, basePrice: number) => {
  try {
    const ai = getAi();
    if (!ai) return [];
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Genera 3 variaciones de precio para "${productName}" (precio base ${basePrice}). Formato JSON: [{"name":"Tamaño","value":"S/M/L","price":xxx}]`,
    });
    try {
      return JSON.parse(response.text || '[]');
    } catch {
      return [];
    }
  } catch (err) {
    console.error('Error generating variations:', err);
    return [];
  }
};