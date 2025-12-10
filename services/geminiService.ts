import { GoogleGenAI } from "@google/genai";
import { getApiKeyCookie } from "../src/utils/cookieUtils";
import { 
  resizeImage, 
  getImageDimensions, 
  is16x9AspectRatio, 
  calculateResolutionDimensions 
} from "../src/utils/imageUtils";
import { ImageResolution } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

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

  // Detect aspect ratio of input image
  const { width, height } = await getImageDimensions(base64Image);
  const is16x9 = is16x9AspectRatio(width, height);
  
  // Calculate target dimensions based on resolution and aspect ratio
  const targetDimensions = calculateResolutionDimensions(resolution, is16x9);

  try {
    const ai = getAIInstance();
    
    // Map resolution to imageSize parameter for API (using calculated dimensions)
    const imageSizeString = `${targetDimensions.width}x${targetDimensions.height}`;
    
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
            text: `Generate a new photorealistic image of this scene from a ${angleDescription}. Keep the subject matter, lighting, and style consistent with the original. Return ONLY the image at ${imageSizeString} resolution.`,
          },
        ],
      },
      generationConfig: {
        imageSize: imageSizeString,
      } as any, // Type assertion needed as the SDK types may not include imageSize
    });

    // Extract image from response
    let generatedImage: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
            generatedImage = `data:image/png;base64,${part.inlineData.data}`;
            break;
        }
      }
    }
    
    if (!generatedImage) {
      throw new Error("No image generated in response");
    }
    
    // Resize image to requested resolution if API didn't respect it
    // This is a workaround for API limitations
    try {
      const resizedImage = await resizeImage(
        generatedImage,
        targetDimensions.width,
        targetDimensions.height
      );
      return resizedImage;
    } catch (resizeError) {
      console.warn('Failed to resize image, returning original:', resizeError);
      return generatedImage;
    }
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

  // Detect aspect ratio of input image
  const { width, height } = await getImageDimensions(base64Image);
  const is16x9 = is16x9AspectRatio(width, height);
  
  // Calculate target dimensions based on resolution and aspect ratio
  const targetDimensions = calculateResolutionDimensions(resolution, is16x9);

  try {
    const ai = getAIInstance();
    
    // Map resolution to imageSize parameter for API (using calculated dimensions)
    const imageSizeString = `${targetDimensions.width}x${targetDimensions.height}`;
    
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
            text: `Edit this image: ${prompt}. Maintain high quality and realism. Return the image at ${imageSizeString} resolution.`,
          },
        ],
      },
      generationConfig: {
        imageSize: imageSizeString,
      } as any, // Type assertion needed as the SDK types may not include imageSize
    });

    let generatedImage: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
            generatedImage = `data:image/png;base64,${part.inlineData.data}`;
            break;
        }
      }
    }
    
    if (!generatedImage) {
      throw new Error("No image generated in response");
    }
    
    // Resize image to requested resolution if API didn't respect it
    // This is a workaround for API limitations
    try {
      const resizedImage = await resizeImage(
        generatedImage,
        targetDimensions.width,
        targetDimensions.height
      );
      return resizedImage;
    } catch (resizeError) {
      console.warn('Failed to resize image, returning original:', resizeError);
      return generatedImage;
    }
  } catch (error) {
    console.error("Gemini API Error (Edit):", error);
    throw error;
  }
};
