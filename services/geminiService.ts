import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PromptFormData, GeneratedResult } from "../types";

const createClient = (apiKey: string) => {
  return new GoogleGenAI({ apiKey });
};

export const generateOptimizedPrompt = async (data: PromptFormData, apiKey: string): Promise<GeneratedResult> => {
  if (!apiKey) {
    throw new Error("Clave API no proporcionada.");
  }

  // MOCK RESPONSE FOR DEMO MODE
  if (apiKey === "DEMO_MODE") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          optimizedPrompt: `Cinematic tracking shot of ${data.subject || "the subject"}, ${data.action || "performing action"}, set in ${data.environment || "a detailed environment"}. Rendered in ${data.style} style with ${data.lighting} lighting. The camera uses a ${data.camera} movement to emphasize depth and scale. High fidelity textures, volumetric fog, 8k resolution, highly detailed physics simulation showing weight and momentum.`,
          technicalDetails: `--video_model grok_2.0 --fps 24 --motion_bucket 127 --resolution ${data.aspectRatio === "16:9" ? "1920x1080" : "1080x1920"}`,
          explanation: "MODO DEMO: Se ha generado un prompt simulado basado en tus inputs. La IA real generaría una descripción mucho más rica y matizada enfocada en la física del movimiento específica de tu solicitud. En este modo de prueba, estamos simulando la estructura correcta del output."
        });
      }, 1500); // Simulate network delay
    });
  }
  
  const client = createClient(apiKey);

  // Ingeniería de prompts específica para Grok / Modelos de Difusión Avanzados
  // Se enfoca en la comprensión espacial y física que caracteriza a estos modelos.
  const systemInstruction = `
    Actúa como un Ingeniero de Prompts Senior especializado en modelos de generación de video de física simulada (como Grok Video, Sora, Gen-3).
    
    Tu tarea es transformar inputs simples en un "Prompt de Ingeniería" optimizado.
    
    CONOCIMIENTO TÉCNICO DE GROK/VIDEO AI:
    1. **Continuidad Temporal**: Estos modelos necesitan saber cómo evoluciona la escena. No uses cortes. Describe un flujo continuo.
    2. **Física y Peso**: Describe cómo interactúan los objetos con la gravedad, la inercia y la resistencia del aire.
    3. **Lenguaje de Cámara**: Usa terminología cinematográfica precisa (Dolly, Truck, Rack Focus) para guiar la "atención" del modelo.
    4. **Detalle Visual**: Materiales, texturas, iluminación volumétrica y paletas de color son cruciales.

    ESTRUCTURA DEL OUTPUT (JSON):
    - optimizedPrompt: El prompt en INGLÉS. Debe ser denso, descriptivo y usar sintaxis de "palabras clave" si beneficia al modelo.
    - technicalDetails: Parámetros técnicos (FPS, Resolución, Motion scale).
    - explanation: Explicación educativa en ESPAÑOL.
  `;

  const userPrompt = `
    Construye un prompt de video de alta fidelidad con estos parámetros:
    
    ESTRUCTURA DE ESCENA:
    - Sujeto Principal: ${data.subject}
    - Acción Física: ${data.action}
    - Entorno/Atmósfera: ${data.environment}
    
    DIRECCIÓN DE ARTE:
    - Estilo: ${data.style}
    - Iluminación: ${data.lighting}
    - Relación de Aspecto: ${data.aspectRatio}
    
    DIRECCIÓN DE FOTOGRAFÍA:
    - Movimiento de Cámara: ${data.camera}
    
    RESTRICCIONES (Negative Prompt):
    - Evitar: ${data.negativePrompt}
    
    Instrucciones Adicionales:
    - Integra el "Negative Prompt" dentro de la descripción positiva excluyendo esos rasgos (ej: en lugar de "no blur", usa "sharp focus throughout").
    - Asegura que la descripción del movimiento de cámara (${data.camera}) coincida con la acción del sujeto.
  `;

  // Define schema manually to match expected library structure
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      optimizedPrompt: { type: Type.STRING, description: "The final highly detailed prompt in English." },
      technicalDetails: { type: Type.STRING, description: "Technical parameters string (e.g. --video_model 1.5 --motion 6)." },
      explanation: { type: Type.STRING, description: "Brief explanation in Spanish about the engineering choices made." },
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