import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFractionExplanation = async (numerator: number, denominator: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain step-by-step how to convert the improper fraction ${numerator}/${denominator} into a mixed number. 
      If it can be simplified, explain that too. Keep the tone helpful and educational, suitable for a student. 
      Format the math clearly. Keep it concise (under 150 words).`,
    });
    
    return response.text || "No explanation could be generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch explanation from Gemini.");
  }
};
