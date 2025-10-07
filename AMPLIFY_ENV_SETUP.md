# AWS Amplify Environment Variables Setup Guide

## 🔧 Setting Environment Variables in AWS Amplify

### Option 1: Via AWS Amplify Console (Recommended)

1. **Open AWS Amplify Console**:
   - Go to: https://console.aws.amazon.com/amplify/
   - Sign in to your AWS account

2. **Select Your App**:
   - Find your Aqualink app in the list
   - Click on the app name

3. **Navigate to Environment Variables**:
   - In the left sidebar, click "App settings"
   - Click "Environment variables"

4. **Add Variables**:
   Click "Manage variables" and add:
   ```
   Variable name: VITE_API_BASE_URL
   Value: http://54.173.35.19:8080
   
   Variable name: VITE_APP_ENV  
   Value: production
   ```

5. **Save and Redeploy**:
   - Click "Save"
   - Go to the main app page
   - Click "Redeploy this version" or trigger a new build

### Option 2: Via AWS CLI (If you have it installed)

```bash
# Set your app ID (find this in Amplify console)
APP_ID="your-amplify-app-id"

# Add environment variables
aws amplify update-app \
  --app-id $APP_ID \
  --environment-variables VITE_API_BASE_URL=http://54.173.35.19:8080,VITE_APP_ENV=production
```

### Option 3: Update .env.production and Redeploy

If you've updated the .env.production file (which we did), you can:

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Update frontend to connect to EC2 backend"
   git push origin main
   ```

2. **Amplify will automatically rebuild** with the new environment file

## 🔍 Verification

After updating:

1. **Check the Amplify build logs** to ensure variables are loaded
2. **Open browser console** on your frontend to see the debug logs
3. **Test API calls** - they should now go to your EC2 backend

## 🚨 Important Notes

- **Update IP if EC2 restarts**: If you stop/start your EC2 instance, the IP might change
- **Use HTTPS in production**: Consider setting up SSL/TLS for your backend
- **Environment-specific configs**: The config.js now auto-detects production vs development

## 🔧 Troubleshooting

If it still doesn't work:

1. **Check browser console** for the debug logs showing which URL is being used
2. **Verify EC2 security group** allows inbound traffic on port 8080
3. **Test backend directly**: Visit http://54.173.35.19:8080/api/health in browser
4. **Clear browser cache** or try incognito mode