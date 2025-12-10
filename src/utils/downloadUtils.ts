import JSZip from 'jszip';
import { GeneratedImage } from '../../types';

/**
 * Sanitize a string to be used as a filename
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert base64 data URL to binary data
 */
function base64ToBinary(base64DataUrl: string): Uint8Array {
  // Remove data URL prefix (e.g., "data:image/png;base64,")
  const base64 = base64DataUrl.replace(/^data:image\/\w+;base64,/, '');
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Download all successfully generated images as a ZIP file
 */
export async function downloadImagesAsZip(images: GeneratedImage[]): Promise<void> {
  // Filter only successful images
  const successfulImages = images.filter(img => img.status === 'success' && img.url);
  
  if (successfulImages.length === 0) {
    throw new Error('No images available to download');
  }

  try {
    const zip = new JSZip();
    
    // Add each image to the ZIP
    for (const image of successfulImages) {
      const filename = `${sanitizeFilename(image.prompt)}.png`;
      const binaryData = base64ToBinary(image.url);
      zip.file(filename, binaryData);
    }
    
    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Create download link and trigger download
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nano-banana-images-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw new Error('Failed to create ZIP file. Please try again.');
  }
}

