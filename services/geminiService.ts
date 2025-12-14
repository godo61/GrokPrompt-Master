import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PromptFormData, GeneratedResult } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing via process.env.API_KEY");
    // We do not throw here to allow the UI to show a nice error message instead of crashing
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateOptimizedPrompt = async (data: PromptFormData): Promise<GeneratedResult> => {
  const client = createClient();
  if (!client) {
    throw new Error("Clave API no configurada.");
  }

  const systemInstruction = `
    Eres un ingeniero de prompts experto en modelos de generación de video de última generación (como Grok Video, Sora, Veo, Gen-3).
    
    Tu objetivo es tomar los inputs fragmentados del usuario y construir un "Prompt Maestro" en INGLÉS.
    
    La tecnología detrás de estos modelos (Diffusion Transformers) funciona mejor con:
    1. Lenguaje natural fluido pero altamente descriptivo.
    2. Descripciones explícitas de la física y el movimiento.
    3. Detalles visuales concretos (iluminación, texturas, tipo de cámara).
    
    Reglas de salida:
    - El prompt principal debe estar en INGLÉS (incluso si el input es español).
    - Debe ser un párrafo cohesivo.
    - Debe incluir palabras clave técnicas integradas naturalmente (e.g., "4k", "highly detailed", "ray tracing").
    - Si se proporciona un "Negative Prompt", incorpóralo en los detalles técnicos (ej: usando sintaxis --no) o asegúrate de que el prompt principal esté fraseado para excluir esos elementos.
  `;

  const userPrompt = `
    Genera un prompt de video optimizado basado en estos datos:
    - Sujeto: ${data.subject}
    - Acción/Movimiento: ${data.action}
    - Entorno: ${data.environment}
    - Cámara: ${data.camera}
    - Iluminación: ${data.lighting}
    - Estilo: ${data.style}
    - Negative Prompt (Elementos a evitar): ${data.negativePrompt}
    - Aspect Ratio deseado: ${data.aspectRatio}
    
    Outputs requeridos en JSON:
    1. optimizedPrompt: El prompt final en Inglés.
    2. technicalDetails: Una lista corta de sufijos técnicos recomendados (ej: "--ar 16:9 --v 6 --no blur").
    3. explanation: Una breve explicación en ESPAÑOL de por qué se estructuró así para el usuario.
  `;

  // Define schema manually to match expected library structure
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      optimizedPrompt: { type: Type.STRING, description: "The final highly detailed prompt in English." },
      technicalDetails: { type: Type.STRING, description: "Technical parameters string." },
      explanation: { type: Type.STRING, description: "Explanation in Spanish." },
    },
    required: ["optimizedPrompt", "technicalDetails", "explanation"],
  };

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for speed on this task
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeneratedResult;
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};