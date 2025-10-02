# AWS Deployment Guide

## AWS Amplify Deployment (Recommended)

### Prerequisites
1. AWS Account
2. GitHub/GitLab repository with your code
3. Your backend API deployed and accessible

### Steps to Deploy

1. **Commit and Push Your Code**
   ```bash
   git add .
   git commit -m "Prepare for AWS deployment"
   git push origin main
   ```

2. **Go to AWS Amplify Console**
   - Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" > "Host web app"

3. **Connect Your Repository**
   - Choose your Git provider (GitHub/GitLab)
   - Select your repository and branch
   - AWS will automatically detect the build settings from `amplify.yml`

4. **Configure Environment Variables**
   In the Amplify console, go to App Settings > Environment Variables and add:
   - `VITE_API_BASE_URL`: Your backend API URL (e.g., https://your-api.com)
   - `VITE_APP_ENV`: production

5. **Deploy**
   - Review settings and click "Save and deploy"
   - AWS will build and deploy your app automatically

### Alternative: Manual Deployment to S3 + CloudFront

If you prefer manual deployment:

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Create S3 bucket**
   - Go to S3 console
   - Create a new bucket with public read access
   - Enable static website hosting

3. **Upload build files**
   - Upload contents of `dist/` folder to S3 bucket

4. **Create CloudFront distribution**
   - Point to your S3 bucket
   - Configure custom error pages for SPA routing

### Environment Variables for Production

Make sure to set these in AWS Amplify:
- `VITE_API_BASE_URL`: Your production API endpoint
- `VITE_APP_ENV`: production

### Post-Deployment Checklist

- [ ] Test all routes work (SPA routing)
- [ ] API calls work with production backend
- [ ] SSL certificate is configured
- [ ] Custom domain configured (if needed)
- [ ] Monitor CloudWatch logs for any issues

### Costs
- AWS Amplify: Pay per build minute + hosting (very affordable for small-medium apps)
- Typically $1-5/month for small applications

### Support
- AWS Amplify automatically handles SSL, CDN, and scaling
- Automatic deployments on Git push
- Built-in monitoring and logging