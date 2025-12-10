/**
 * Get image dimensions from a base64 image
 * @param base64Image - Base64 data URL of the image
 * @returns Promise resolving to { width, height }
 */
export function getImageDimensions(base64Image: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = base64Image;
  });
}

/**
 * Detect if an image has a 16:9 aspect ratio (within tolerance)
 * @param width - Image width
 * @param height - Image height
 * @param tolerance - Tolerance for aspect ratio detection (default 0.1)
 * @returns true if the image is approximately 16:9
 */
export function is16x9AspectRatio(width: number, height: number, tolerance: number = 0.1): boolean {
  const aspectRatio = width / height;
  const targetRatio = 16 / 9; // ~1.7778
  return Math.abs(aspectRatio - targetRatio) < tolerance;
}

/**
 * Calculate resolution dimensions based on resolution level and aspect ratio
 * @param resolution - Resolution level ('1K', '2K', '4K')
 * @param is16x9 - Whether the image is 16:9 aspect ratio
 * @returns { width, height } dimensions
 */
export function calculateResolutionDimensions(
  resolution: '1K' | '2K' | '4K',
  is16x9: boolean
): { width: number; height: number } {
  if (is16x9) {
    // 16:9 aspect ratio resolutions
    switch (resolution) {
      case '1K':
        return { width: 1920, height: 1080 }; // 1080p
      case '2K':
        return { width: 3840, height: 2160 }; // 4K UHD
      case '4K':
        return { width: 5504, height: 3072 }; // As specified by user
    }
  } else {
    // 1:1 (square) aspect ratio resolutions
    switch (resolution) {
      case '1K':
        return { width: 1024, height: 1024 };
      case '2K':
        return { width: 2048, height: 2048 };
      case '4K':
        return { width: 4096, height: 4096 };
    }
  }
}

/**
 * Resize a base64 image to the specified dimensions
 * @param base64Image - Base64 data URL of the image
 * @param targetWidth - Target width in pixels
 * @param targetHeight - Target height in pixels
 * @returns Promise resolving to resized base64 image data URL
 */
export function resizeImage(
  base64Image: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Use high-quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw and resize
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Convert to base64
      try {
        const resizedBase64 = canvas.toDataURL('image/png', 1.0);
        resolve(resizedBase64);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = base64Image;
  });
}

