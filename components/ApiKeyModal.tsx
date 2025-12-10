import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../src/components/ui/dialog';
import { Input } from '../src/components/ui/input';
import { Button } from '../src/components/ui/button';
import { setApiKeyCookie } from '../src/utils/cookieUtils';

interface ApiKeyModalProps {
  open: boolean;
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ open, onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate API key format (basic check - starts with AIza)
      if (!apiKey.trim().startsWith('AIza')) {
        setError('Invalid API key format. Gemini API keys typically start with "AIza"');
        setIsSubmitting(false);
        return;
      }

      // Store in cookie
      setApiKeyCookie(apiKey.trim());
      
      // Notify parent component
      onApiKeySet(apiKey.trim());
    } catch (err) {
      setError('Failed to save API key. Please try again.');
      console.error('Error setting API key:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enter Your Gemini API Key</DialogTitle>
            <DialogDescription>
              Your API key is stored locally in your browser and never sent to our servers.
              You can get your API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                Google AI Studio
              </a>
              .
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="api-key" className="text-sm font-medium">
                API Key
              </label>
              <Input
                id="api-key"
                type="password"
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError(null);
                }}
                disabled={isSubmitting}
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !apiKey.trim()}
              isLoading={isSubmitting}
            >
              Save API Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
