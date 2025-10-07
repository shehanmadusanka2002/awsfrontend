// API configuration
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

// Other configuration variables can be added here
export const IS_PRODUCTION = APP_ENV === 'production';
export const IS_DEVELOPMENT = APP_ENV === 'development';

// Debug information
console.log('🔧 Frontend Configuration:');
console.log('   Environment:', APP_ENV);
console.log('   API Base URL:', API_BASE_URL);
console.log('   Hostname:', window.location.hostname);