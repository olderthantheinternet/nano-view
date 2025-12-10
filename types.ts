export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  timestamp: number;
}

export interface GenerationConfig {
  angle: string;
  description: string;
}

export type ImageResolution = '1K' | '2K' | '4K';

export interface ResolutionOption {
  value: ImageResolution;
  label: string;
  width: number;
  height: number;
}

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
  { value: '1K', label: '1K (1024×1024)', width: 1024, height: 1024 },
  { value: '2K', label: '2K (2048×2048)', width: 2048, height: 2048 },
  { value: '4K', label: '4K (4096×4096)', width: 4096, height: 4096 },
];

export interface PricingConfig {
  costPerImage: number; // Cost in USD per image
}

export const RESOLUTION_PRICING: Record<ImageResolution, PricingConfig> = {
  '1K': { costPerImage: 0.0387 }, // ~1,290 tokens at $30 per 1M tokens
  '2K': { costPerImage: 0.0387 }, // ~1,290 tokens at $30 per 1M tokens
  '4K': { costPerImage: 0.06 },   // ~2,000 tokens at $30 per 1M tokens
};

export const NUM_IMAGES_TO_GENERATE = 9;

export const ANGLES: GenerationConfig[] = [
  { angle: "Isometric", description: "isometric view from top-right corner" },
  { angle: "Bird's Eye", description: "direct top-down bird's eye view" },
  { angle: "Worm's Eye", description: "low angle worm's eye view looking up" },
  { angle: "Wide Angle", description: "wide angle lens view capturing more context" },
  { angle: "Side Profile (L)", description: "profile view from the left side" },
  { angle: "Side Profile (R)", description: "profile view from the right side" },
  { angle: "Close Up", description: "detailed close-up shot of the main subject" },
  { angle: "Dutch Angle", description: "dramatic dutch angle (tilted horizon)" },
  { angle: "Cinematic", description: "cinematic establishing shot from a distance" }
];
