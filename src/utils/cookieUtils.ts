/**
 * Cookie utility functions for managing API key storage
 */

const COOKIE_NAME = 'gemini_api_key';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Set a cookie with the API key
 */
export function setApiKeyCookie(apiKey: string): void {
  // Use secure cookie settings
  // Note: secure flag requires HTTPS, so we'll set it conditionally
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(apiKey)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Strict${secureFlag}`;
}

/**
 * Get the API key from cookie
 */
export function getApiKeyCookie(): string | null {
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}

/**
 * Delete the API key cookie
 */
export function deleteApiKeyCookie(): void {
  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; SameSite=Strict`;
}

/**
 * Check if API key cookie exists
 */
export function hasApiKeyCookie(): boolean {
  return getApiKeyCookie() !== null;
}
