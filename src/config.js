// API configuration
// Set default backend host to the provided IP; can be overridden with VITE_API_BASE_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://54.173.35.19:8080';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// Other configuration variables can be added here
export const IS_PRODUCTION = APP_ENV === 'production';
export const IS_DEVELOPMENT = APP_ENV === 'development';