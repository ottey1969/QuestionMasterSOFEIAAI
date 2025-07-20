# Quick Deployment Guide

Your Sofeia AI platform is ready for deployment! Here's the simplest way to get it online:

## Method 1: Render (Recommended - Free Tier Available)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Sofeia AI platform ready for deployment"
git branch -M main
git remote add origin https://github.com/YourUsername/sofeia-ai.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com and create account
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `vite build && npx esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --external:better-sqlite3 --external:sqlite3 --external:pg-native --format=esm --packages=external`
   - **Start Command**: `node dist/index.js`

### Step 3: Add Environment Variables
In Render dashboard, add these environment variables:
- `NODE_ENV=production`
- `DATABASE_URL` (get from Render PostgreSQL)
- `SESSION_SECRET` (generate random 64-char string)
- `GROQ_API_KEY` (from console.groq.com)
- `PERPLEXITY_API_KEY` (from perplexity.ai/settings/api)
- `ANTHROPIC_API_KEY` (from console.anthropic.com)
- `PAYPAL_CLIENT_ID` & `PAYPAL_CLIENT_SECRET` (from developer.paypal.com)

### Step 4: Create Database
- In Render: New → PostgreSQL
- Copy connection URL to `DATABASE_URL` variable

## Method 2: Replit Deployment (One-Click)

1. In your Replit project, click "Deploy" tab
2. Choose "Autoscale" deployment
3. Add environment variables (same as above)
4. Click "Deploy"

## Working Features Right Now:

✅ **General Questions** - Groq API (working perfectly)
✅ **Research Queries** - Perplexity API (needs valid key)
⚠️ **Grant Writing & SEO** - Anthropic API (needs valid API key)

## Current Status:
- Your platform has intelligent AI routing
- Groq responses work immediately for general questions
- Grant writing will fallback to Groq if Anthropic key issues persist
- Real-time WebSocket chat is fully functional
- PayPal integration ready for credit purchases

## Get API Keys:
- **Groq**: https://console.groq.com/keys (Free tier: 14,400 requests/day)
- **Perplexity**: https://www.perplexity.ai/settings/api ($5 minimum)
- **Anthropic**: https://console.anthropic.com/ (Free tier: $5 credit)

## Test Your Deployment:
Try these messages after deployment:
1. "What is artificial intelligence?" → Should use Groq
2. "Research latest AI news" → Should use Perplexity
3. "Write a grant proposal" → Should use Anthropic or fallback to Groq

Your platform is production-ready with real AI capabilities!