import { GoogleGenAI } from "@google/genai";
import { getApiKeyCookie } from "../src/utils/cookieUtils";
import { ImageResolution, RESOLUTION_OPTIONS } from "../types";

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Get the GoogleGenAI instance with API key from cookie
 */
function getAIInstance(): GoogleGenAI {
  const apiKey = getApiKeyCookie();
  
  if (!apiKey) {
    throw new Error("API key not found. Please set your Gemini API key.");
  }
  
  return new GoogleGenAI({ apiKey });
}

/**
 * Generates a variation of an image based on a specific angle/prompt.
 */
export const generateImageVariation = async (
  base64Image: string,
  angleDescription: string,
  resolution: ImageResolution = '1K'
): Promise<string> => {
  // Remove header if present for sending to API (though inlineData usually handles it, cleaner to be sure)
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  // Get resolution dimensions
  const resolutionOption = RESOLUTION_OPTIONS.find(opt => opt.value === resolution) || RESOLUTION_OPTIONS[0];

  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', // Assuming jpeg/png input, API is flexible
            },
          },
          {
            text: `Generate a new photorealistic image of this scene from a ${angleDescription}. Keep the subject matter, lighting, and style consistent with the original. Return ONLY the image.`,
          },
        ],
      },
      generationConfig: {
        width: resolutionOption.width,
        height: resolutionOption.height,
      },
    });

    // Extract image from response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Edits an image based on a user prompt.
 */
export const editImageWithPrompt = async (
  base64Image: string,
  prompt: string,
  resolution: ImageResolution = '1K'
): Promise<string> => {
   const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  // Get resolution dimensions
  const resolutionOption = RESOLUTION_OPTIONS.find(opt => opt.value === resolution) || RESOLUTION_OPTIONS[0];

  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `Edit this image: ${prompt}. Maintain high quality and realism.`,
          },
        ],
      },
      generationConfig: {
        width: resolutionOption.width,
        height: resolutionOption.height,
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Gemini API Error (Edit):", error);
    throw error;
  }
};
