# Environment Variables Configuration

This document explains how to configure environment variables for the AquaLink frontend application.

## Overview

The frontend uses Vite's environment variable system. All variables must be prefixed with `VITE_` to be accessible in the browser.

## Environment Files

### Local Development
- `.env` - Default environment variables (committed to repo)
- `.env.development` - Development-specific variables (committed to repo)
- `.env.local` - Local overrides (not committed, add to .gitignore)

### Production
- `.env.production` - Production-specific variables (committed to repo)
- AWS Amplify Console - Set production variables in the Amplify Console

## Available Environment Variables

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://54.173.35.19:8080` | `http://localhost:8080` |
| `VITE_APP_ENV` | Application environment | `production` | `development` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_APP_NAME` | Application name | `AquaLink` | `AquaLink (Dev)` |
| `VITE_APP_VERSION` | Application version | `1.0.0` | `1.0.0-beta` |
| `VITE_MAX_FILE_SIZE` | Max file upload size in bytes | `5242880` (5MB) | `10485760` (10MB) |
| `VITE_ALLOWED_IMAGE_TYPES` | Allowed image MIME types | `image/jpeg,image/jpg,image/png,image/gif` | Custom types |
| `VITE_ENABLE_DEBUG_MODE` | Enable debug logging | `false` | `true` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `true` | `false` |

## Setup Instructions

### For Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your local configuration:
   ```bash
   VITE_API_BASE_URL=http://localhost:8080
   VITE_APP_ENV=development
   VITE_ENABLE_DEBUG_MODE=true
   ```

### For AWS Amplify Deployment

1. Go to your Amplify Console
2. Navigate to App Settings > Environment Variables
3. Add the following variables:
   ```
   VITE_API_BASE_URL = http://54.173.35.19:8080
   VITE_APP_ENV = production
   VITE_ENABLE_DEBUG_MODE = false
   VITE_ENABLE_ANALYTICS = true
   ```

## Usage in Code

Import variables from the config file:

```javascript
import { API_BASE_URL, IS_PRODUCTION, debugLog } from './config';

// Use the API base URL
const response = await fetch(`${API_BASE_URL}/api/endpoint`);

// Conditional behavior based on environment
if (IS_PRODUCTION) {
  // Production-only code
}

// Debug logging (only shows in development when enabled)
debugLog('User action:', userAction);
```

## Environment Priority

Vite loads environment variables in this order (highest priority first):

1. `.env.local` - Local overrides (not committed)
2. `.env.[mode].local` - Mode-specific local overrides
3. `.env.[mode]` - Mode-specific variables
4. `.env` - Default variables

## Security Notes

- Never commit sensitive data to environment files
- Use `.env.local` for sensitive local configuration
- Set production secrets in AWS Amplify Console, not in committed files
- All `VITE_` prefixed variables are exposed to the browser, so avoid sensitive data

## Troubleshooting

### Variable Not Loading
- Ensure variable name starts with `VITE_`
- Restart the development server after adding new variables
- Check the variable is defined in the correct environment file

### Production Deployment Issues
- Verify variables are set in AWS Amplify Console
- Check the build logs for environment variable values (non-sensitive ones)
- Ensure the production build is using the correct environment file