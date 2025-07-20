# Deployment Guide - Render

This guide walks you through deploying Sofeia AI to Render.com step-by-step.

## Prerequisites

1. GitHub account with your code repository
2. Render account (free tier available)
3. All required API keys ready

## Step 1: Prepare Your Repository

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/sofeia-ai.git
   git push -u origin main
   ```

2. **Verify build scripts** in `package.json`:
   ```json
   {
     "scripts": {
       "build": "npm run build:frontend && npm run build:backend",
       "build:frontend": "vite build",
       "build:backend": "esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --external:better-sqlite3 --external:sqlite3 --external:pg-native",
       "start": "node dist/index.js",
       "dev": "NODE_ENV=development tsx server/index.ts"
     }
   }
   ```

## Step 2: Create PostgreSQL Database on Render

1. **Login to Render**: Go to https://render.com and sign in
2. **Create Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `sofeia-ai-db`
   - Database: `sofeia_ai`
   - User: `sofeia_user`
   - Region: Choose closest to your users
   - Plan: Free (or paid for production)
   - Click "Create Database"

3. **Get Connection Details**:
   - Wait for database to be ready (2-3 minutes)
   - Copy the "External Database URL" - you'll need this

## Step 3: Create Web Service on Render

1. **Create Service**:
   - Click "New +" → "Web Service"
   - Select "Build and deploy from a Git repository"
   - Connect your GitHub account if not already connected
   - Choose your repository

2. **Configure Service**:
   - **Name**: `sofeia-ai`
   - **Environment**: `Node`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Root Directory**: Leave blank (uses root)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

## Step 4: Set Environment Variables

In the Render dashboard for your web service, scroll down to "Environment Variables" and add:

```env
NODE_ENV=production
DATABASE_URL=<paste-your-render-postgres-url>
SESSION_SECRET=<generate-random-string-64-chars>
GROQ_API_KEY=<your-groq-api-key>
PERPLEXITY_API_KEY=<your-perplexity-api-key>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
PAYPAL_CLIENT_ID=<your-paypal-client-id>
PAYPAL_CLIENT_SECRET=<your-paypal-client-secret>
```

> **Note**: All API keys should be production-ready. The app features real-time chat with WebSocket support, HTML-formatted responses with copy functionality, and proper loading states for enhanced user experience.

### How to get API keys:

- **Groq**: https://console.groq.com/keys (free tier available)
- **Perplexity**: https://www.perplexity.ai/settings/api (paid)
- **Anthropic**: https://console.anthropic.com/ (free tier available)
- **PayPal**: https://developer.paypal.com/ (sandbox for testing)

### Generate SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 5: Deploy

1. **Initial Deploy**:
   - Click "Create Web Service"
   - Render will start building and deploying
   - This takes 5-10 minutes for first deploy

2. **Monitor Build**:
   - Check the "Events" tab for build progress
   - Look for any error messages in logs

3. **Database Setup**:
   - Once deployed, the app will automatically create database tables
   - Monitor logs to ensure database connection is successful

## Step 6: Configure Custom Domain (Optional)

1. **Add Domain**:
   - In service settings, scroll to "Custom Domains"
   - Add your domain (e.g., `sofeia-ai.com`)
   - Update DNS records as instructed by Render

2. **SSL Certificate**:
   - Render automatically provides SSL certificates
   - Wait for certificate validation (can take up to 24 hours)

## Step 7: Test Deployment

1. **Visit Your App**:
   - Use the provided `.onrender.com` URL
   - Test all functionality:
     - Landing page loads
     - Chat interface works
     - AI responses are generated
     - WebSocket connection established

2. **Test AI Services**:
   - Try different message types:
     - "What is artificial intelligence?" (should use Groq - 1 credit)
     - "Write me a blog post about contentscale" (should use Perplexity + Anthropic - 2 credits)
     - "Help me with grant writing for AI research" (should use Anthropic - 3 credits)
   - Verify HTML formatting with headings, bullets, and copy buttons work
   - Check that "Sofeia AI is thinking..." loading states appear

## Troubleshooting

### Common Issues:

1. **Build Fails**:
   ```
   Error: Cannot find module 'xyz'
   ```
   - Ensure all dependencies are in `package.json`
   - Run `npm install` locally and commit `package-lock.json`

2. **Database Connection Failed**:
   ```
   Error: Connection refused
   ```
   - Verify DATABASE_URL is correct
   - Ensure database is running and accessible

3. **API Keys Not Working**:
   ```
   Error: Invalid API key
   ```
   - Double-check all API keys in environment variables
   - Ensure no extra spaces or characters

4. **WebSocket Connection Failed**:
   - Verify the WebSocket endpoint is correctly configured
   - Check that Render supports WebSocket connections (it does)

### Environment-Specific Issues:

1. **Production vs Development**:
   - Ensure `NODE_ENV=production` is set
   - Check that production API endpoints are used (not sandbox)

2. **PayPal Sandbox vs Live**:
   - For testing: use sandbox credentials
   - For production: switch to live PayPal credentials

## Monitoring and Maintenance

1. **Logs**: Check Render logs regularly for errors
2. **Metrics**: Monitor response times and error rates
3. **Updates**: Deploy updates by pushing to main branch
4. **Database**: Monitor database usage and upgrade plan if needed

## Scaling

1. **Horizontal Scaling**: Render supports auto-scaling
2. **Database**: Upgrade PostgreSQL plan for more connections
3. **CDN**: Consider adding Cloudflare for global performance

## Security Checklist

- [ ] All API keys are in environment variables (not code)
- [ ] SESSION_SECRET is strong and unique
- [ ] Database has restricted access
- [ ] HTTPS is enabled (automatic on Render)
- [ ] PayPal is using live credentials for production

## Cost Estimation

**Free Tier** (development/testing):
- Web Service: $0 (750 hours/month)
- PostgreSQL: $0 (90 days, then $7/month)
- Total: $0-7/month

**Production** (recommended):
- Web Service: $7/month (always on)
- PostgreSQL: $20/month (production tier)
- Total: $27/month

## Support

If you encounter issues:
1. Check Render documentation: https://render.com/docs
2. Review application logs in Render dashboard
3. Test API keys individually
4. Contact: +31 628 073 996 (WhatsApp)
5. Support: https://paypal.me/ojgmedia?country.x=NL&locale.x=en_US