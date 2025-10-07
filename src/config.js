// API configuration
<<<<<<< HEAD
const getDefaultApiUrl = () => {
  // Check if we're in production (Amplify)
  if (window.location.hostname.includes('amplifyapp.com')) {
    return 'http://54.173.35.19:8080';
  }
  // Default to localhost for development
  return 'http://localhost:8080';
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultApiUrl();
export const APP_ENV = import.meta.env.VITE_APP_ENV || (window.location.hostname.includes('amplifyapp.com') ? 'production' : 'development');
=======
// Set default backend host to the provided IP; can be overridden with VITE_API_BASE_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://54.173.35.19:8080';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
>>>>>>> d043df27f7682ead48aaa0ecc25782e98be63061

// App configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AquaLink';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Feature flags
export const ENABLE_DEBUG_MODE = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

// File upload configuration
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880; // 5MB default
export const ALLOWED_IMAGE_TYPES = import.meta.env.VITE_ALLOWED_IMAGE_TYPES?.split(',') || ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

// Environment helpers
export const IS_PRODUCTION = APP_ENV === 'production';
export const IS_DEVELOPMENT = APP_ENV === 'development';

<<<<<<< HEAD
// Debug information
console.log('🔧 Frontend Configuration:');
console.log('   Environment:', APP_ENV);
console.log('   API Base URL:', API_BASE_URL);
console.log('   Hostname:', window.location.hostname);
=======
// Debug logging helper
export const debugLog = (...args) => {
  if (ENABLE_DEBUG_MODE) {
    console.log('[DEBUG]', ...args);
  }
};
>>>>>>> d043df27f7682ead48aaa0ecc25782e98be63061
