import { ImageResolution, RESOLUTION_PRICING, NUM_IMAGES_TO_GENERATE } from '../../types';

/**
 * Calculate the estimated cost for generating images
 * @param resolution - The selected image resolution
 * @param numImages - Number of images to generate (defaults to NUM_IMAGES_TO_GENERATE)
 * @returns The total estimated cost in USD
 */
export function calculateGenerationCost(
  resolution: ImageResolution,
  numImages: number = NUM_IMAGES_TO_GENERATE
): number {
  const pricing = RESOLUTION_PRICING[resolution];
  return pricing.costPerImage * numImages;
}

/**
 * Format cost for display
 * @param cost - Cost in USD
 * @returns Formatted cost string (e.g., "$0.35" or "$0.04")
 */
export function formatCost(cost: number): string {
  // Round to 2 decimal places, but show more precision if needed
  const rounded = Math.round(cost * 100) / 100;
  
  // If the rounded value is the same as the original (within 0.01), show 2 decimals
  // Otherwise show up to 4 decimals for accuracy
  if (Math.abs(rounded - cost) < 0.001) {
    return `$${rounded.toFixed(2)}`;
  }
  
  // Show 3-4 decimal places for more precision
  return `$${cost.toFixed(4)}`;
}

/**
 * Get cost per image for a given resolution
 * @param resolution - The selected image resolution
 * @returns Cost per image in USD
 */
export function getCostPerImage(resolution: ImageResolution): number {
  return RESOLUTION_PRICING[resolution].costPerImage;
}

