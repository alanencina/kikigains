import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserProfile } from "../types";

// Initialize client lazily to avoid immediate crash if key is missing
let ai: any = null;
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY; // Fallback just in case

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI", e);
  }
}

const MODEL_NAME = "models/gemini-2.5-flash";

// Debug: List available models to console to verify API access
if (ai) {
  (async () => {
    try {
      console.log("Fetching available Gemini models...");
      const response = await ai.models.list();
      console.log("AVAILABLE MODELS:", response.models?.map((m: any) => m.name));
    } catch (e) {
      console.error("Failed to list models:", e);
    }
  })();
}

export class GeminiService {
  private chat: any | null = null;

  constructor() {
    // Initialize Chat if needed, lazily or here
  }

  // --- Chat ---
  public async sendMessage(message: string, history: { role: string; parts: { text: string }[] }[] = []): Promise<string> {
    if (!ai) {
      console.error("Gemini AI not initialized. Missing API Key?");
      return "Error: No se pudo conectar con la IA. Verifica la configuración de la API Key.";
    }

    try {
      if (!this.chat) {
        console.log("Initializing new chat session with model:", MODEL_NAME);
        // Transform history to format expected by SDK if necessary, or pass distinct parts
        // Note: The new SDK might strictly enforce role 'user' | 'model'
        this.chat = ai.chats.create({
          model: MODEL_NAME,
          config: {
            systemInstruction: "Eres KikiGains, una IA experta en fuerza y acondicionamiento físico de élite. Tienes conocimientos sobre powerlifting, culturismo y biomecánica. Eres motivador, conciso y te basas en datos. RESPONDE SIEMPRE EN ESPAÑOL.",
          },
          history: history,
        });
      }

      console.log("Sending message to Gemini:", message);
      const result = await this.chat.sendMessage({ message });
      const responseText = result.text || (result.response && result.response.text && result.response.text());
      console.log("Gemini response received");
      return responseText || "No pude generar una respuesta.";
    } catch (error) {
      console.error("Chat Error Detailed:", error);
      throw error;
    }
  }

  // --- Vision (Image Analysis) ---
  public async analyzeImage(base64Image: string, mimeType: string, prompt: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
            {
              text: prompt + " (Responde en Español)",
            },
          ],
        },
      });
      return response.text || "No analysis available.";
    } catch (error) {
      console.error("Image Analysis Error:", error);
      throw error;
    }
  }

  // --- Video Understanding ---
  public async analyzeVideo(base64Video: string, mimeType: string, prompt: string): Promise<string> {
    try {
      // Note: For production with large videos, use File API. For this demo, inlineData (limited size) is used.
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Video,
              },
            },
            {
              text: prompt + " (Responde en Español)",
            },
          ],
        },
      });
      return response.text || "No analysis available.";
    } catch (error) {
      console.error("Video Analysis Error:", error);
      throw error;
    }
  }

  // --- Training Plan Generation ---
  public async generateTrainingPlan(goal: string): Promise<string> {
    try {
      const prompt = `Design a specialized single-session training workout for an elite athlete with the following focus: ${goal}.
      
      Provide the output in structured markdown with these sections:
      ## Enfoque de la Sesión: [Goal]
      
      ### Calentamiento (Específico)
      * [List exercises]
      
      ### Bloque Principal (Fuerza/Potencia)
      * [Main Lift] - [Sets]x[Reps] @ [Intensity]
      
      ### Trabajo Accesorio
      * [List exercises]
      
      ### Notas
      * [Technical cues or intensity notes]
      
      Keep it high-performance oriented. STRICTLY IN SPANISH.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });
      return response.text || "Unable to generate plan.";
    } catch (error) {
      console.error("Training Gen Error:", error);
      throw error;
    }
  }

  // --- Community Challenge Generation ---
  public async generateChallenge(theme: string): Promise<string> {
    try {
      const prompt = `Create a fun, competitive, and safe fitness challenge for an online community of athletes based on this theme: "${theme}".
      
      Provide the output in structured markdown:
      ## Nombre del Reto
      
      ### La Misión
      [Brief exciting description]
      
      ### Reglas
      * [Rule 1]
      * [Rule 2]
      
      ### Puntuación
      [How to win points]
      
      ### Duración
      [Timeframe, e.g. 1 week]
      
      Make it engaging and suitable for a social feed. STRICTLY IN SPANISH.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });
      return response.text || "Unable to generate challenge.";
    } catch (error) {
      console.error("Challenge Gen Error:", error);
      throw error;
    }
  }

  // --- Onboarding Initial Plan ---
  public async generateInitialPlan(profile: UserProfile): Promise<string> {
    try {
      const prompt = `Act as an expert fitness coach. Create a brief, high-level training summary for a new user with these stats:
      - Name: ${profile.name}
      - Goal: ${profile.goal}
      - Gender: ${profile.gender}
      - Age: ${profile.age}
      - Weight: ${profile.weight}kg
      - Height: ${profile.height}cm
      - Frequency: ${profile.daysPerWeek} days/week

      Output a structured plan in Markdown. 
      It should include:
      1. A personalized welcome message.
      2. A proposed weekly split (e.g., Lun: Superior, Mar: Inferior) fitting their frequency.
      3. Top 3 focus exercises for their goal.
      4. A "Golden Rule" for them (e.g. for weight loss: "Caloric deficit is key").

      Keep it concise, motivating, and professional. STRICTLY IN SPANISH.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      return response.text || "No plan generated.";
    } catch (error) {
      console.error("Onboarding Plan Gen Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();