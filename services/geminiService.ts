import { GoogleGenAI } from "@google/genai";
import { getApiKeyCookie } from "../src/utils/cookieUtils";
import { 
  resizeImage, 
  getImageDimensions, 
  is16x9AspectRatio, 
  calculateResolutionDimensions 
} from "../src/utils/imageUtils";
import { ImageResolution } from "../types";

const MODEL_NAME = 'gemini-3-pro-image-preview';

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
    
    // Map aspect ratio to API format
    const aspectRatio = is16x9 ? "16:9" : "1:1";
    
    // Map resolution to API format (1K, 2K, 4K)
    const imageSize = resolution; // Already in correct format
    
    // Log API request for debugging
    console.log('API Request:', {
      model: MODEL_NAME,
      aspectRatio,
      imageSize,
      targetDimensions
    });
    
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
        aspect_ratio: aspectRatio,
        image_size: imageSize,
      } as any, // Type assertion needed as the SDK types may not include these parameters
    });

    // Extract image from response
    let generatedImage: string | null = null;
    
    // Log response structure for debugging
    console.log('API Response structure:', {
      hasCandidates: !!response.candidates,
      candidatesLength: response.candidates?.length,
      firstCandidate: response.candidates?.[0] ? {
        finishReason: response.candidates[0].finishReason,
        hasContent: !!response.candidates[0].content,
        partsCount: response.candidates[0].content?.parts?.length,
        partsTypes: response.candidates[0].content?.parts?.map((p: any) => Object.keys(p)),
        safetyRatings: response.candidates[0].safetyRatings
      } : null
    });
    
    // Check for errors in response
    if (response.candidates?.[0]?.finishReason) {
      const finishReason = response.candidates[0].finishReason;
      if (finishReason !== 'STOP' && finishReason !== 'MAX_TOKENS') {
        console.error('Finish reason:', finishReason);
        throw new Error(`Generation failed: ${finishReason}`);
      }
    }
    
    // Check for safety ratings that might block the response
    if (response.candidates?.[0]?.safetyRatings) {
      const safetyRatings = response.candidates[0].safetyRatings;
      const blocked = safetyRatings.some((rating: any) => 
        rating.probability === 'HIGH' || rating.probability === 'MEDIUM'
      );
      if (blocked) {
        console.error('Content blocked by safety filter:', safetyRatings);
        throw new Error('Content was blocked by safety filters');
      }
    }
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        // Check for inlineData with image
        if (part.inlineData && part.inlineData.data) {
            generatedImage = `data:image/png;base64,${part.inlineData.data}`;
            break;
        }
        // Check for text that might indicate an error
        if (part.text) {
          console.warn('Text response received:', part.text);
        }
      }
    }
    
    if (!generatedImage) {
      // Log the full response structure for debugging
      console.error('No image found in response. Full response:', response);
      throw new Error("No image generated in response. The API may have returned text or an error instead.");
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
    
    // Map aspect ratio to API format
    const aspectRatio = is16x9 ? "16:9" : "1:1";
    
    // Map resolution to API format (1K, 2K, 4K)
    const imageSize = resolution; // Already in correct format
    
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
        aspect_ratio: aspectRatio,
        image_size: imageSize,
      } as any, // Type assertion needed as the SDK types may not include these parameters
    });

    let generatedImage: string | null = null;
    
    // Check for errors in response
    if (response.candidates?.[0]?.finishReason) {
      const finishReason = response.candidates[0].finishReason;
      if (finishReason !== 'STOP' && finishReason !== 'MAX_TOKENS') {
        console.error('Finish reason:', finishReason);
        throw new Error(`Edit failed: ${finishReason}`);
      }
    }
    
    // Check for safety ratings that might block the response
    if (response.candidates?.[0]?.safetyRatings) {
      const safetyRatings = response.candidates[0].safetyRatings;
      const blocked = safetyRatings.some((rating: any) => 
        rating.probability === 'HIGH' || rating.probability === 'MEDIUM'
      );
      if (blocked) {
        console.error('Content blocked by safety filter:', safetyRatings);
        throw new Error('Content was blocked by safety filters');
      }
    }
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        // Check for inlineData with image
        if (part.inlineData && part.inlineData.data) {
            generatedImage = `data:image/png;base64,${part.inlineData.data}`;
            break;
        }
        // Check for text that might indicate an error
        if (part.text) {
          console.warn('Text response received:', part.text);
        }
      }
    }
    
    if (!generatedImage) {
      // Log the full response structure for debugging
      console.error('No image found in response. Full response:', response);
      throw new Error("No image generated in response. The API may have returned text or an error instead.");
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
