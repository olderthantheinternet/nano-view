import React from 'react';
import { ImageResolution, RESOLUTION_OPTIONS, NUM_IMAGES_TO_GENERATE } from '../types';
import { calculateGenerationCost, formatCost, getCostPerImage } from '../src/utils/costUtils';

interface ResolutionSelectorProps {
  value: ImageResolution;
  onChange: (resolution: ImageResolution) => void;
  disabled?: boolean;
}

export const ResolutionSelector: React.FC<ResolutionSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">
        Image Resolution
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ImageResolution)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {RESOLUTION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="space-y-1">
        <p className="text-xs text-zinc-500">
          Higher resolution = better quality but slower generation
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">
            Estimated cost:
          </span>
          <span className="text-yellow-400 font-medium">
            {formatCost(calculateGenerationCost(value))} for {NUM_IMAGES_TO_GENERATE} images
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          ({formatCost(getCostPerImage(value))} per image)
        </p>
      </div>
    </div>
  );
};

