# GitHub Deployment Guide - Sofeia AI Agent v2025

Complete deployment guide for Sofeia AI Agent with advanced SEO optimization, C.R.A.F.T framework, and AI search engine compatibility.

## 🚀 Project Overview

**Sofeia AI Agent** is a production-ready autonomous AI platform featuring:
- **Elite AI Integration**: Groq (1-credit), Perplexity + Anthropic (2-credit SEO), Anthropic (3-credit grants)
- **Professional AI Prompts**: Enhanced global grant writing + comprehensive SEO content strategist with E-E-A-T optimization
- **RankMath SEO Optimization**: 100/100 score protocol with complete HTML structure and schema markup
- **C.R.A.F.T Framework**: Cut fluff, Review/optimize, Add media, Fact-check, Trust-build methodology across all services
- **AI Search Engine Ready**: Google AI Overview, Voice Search, Featured Snippets optimization
- **Professional Credit System**: €35/month (150 questions) and €300/month (1500 questions)
- **Smart Country Detection**: Prioritizes government sources (India: gov.in, USA: .gov, UK: .gov.uk)
- **Real-time Chat**: WebSocket-based with comprehensive loading states and interactive thinking indicators
- **IP-Based Access**: 5 free questions per IP with admin controls (IP: 112.198.165.82 = unlimited)
- **PayPal Integration**: Direct payment links for credit purchases and admin support
- **Stable Deployment**: Fixed compilation errors and optimized for production deployment

## 📋 Prerequisites

- GitHub account
- Deployment platform account (Render/Railway/Vercel)
- All required API keys
- PayPal business account

## 🏗️ Project Structure

```
sofeia-ai/
├── client/                 # React frontend with Vite
├── server/                 # Express backend
├── shared/                 # Shared schemas and types
├── GITHUB_DEPLOYMENT.md    # This file
├── package.json           # Dependencies and scripts
└── .env.example           # Environment variables template
```

## 🔧 Step 1: Repository Setup

### Clone and Push to GitHub

```bash
# Clone or create your repository
git clone https://github.com/yourusername/sofeia-ai.git
cd sofeia-ai

# If creating new repository
git init
git add .
git commit -m "Initial commit: Sofeia AI Agent v2025"
git branch -M main
git remote add origin https://github.com/yourusername/sofeia-ai.git
git push -u origin main
```

### Verify Build Configuration

Check `package.json` has correct scripts:

```json
{
  "name": "sofeia-ai-agent",
  "version": "2.0.0",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push"
  }
}
```

## 🗄️ Step 2: Database Setup

### Render PostgreSQL (Recommended)

1. **Create Database**:
   - Go to https://render.com/dashboard
   - Click "New +" → "PostgreSQL"
   - Name: `sofeia-ai-database`
   - Database: `sofeia_ai`
   - User: `sofeia_user`
   - Region: Choose closest to users
   - Plan: Free (development) or Starter+ (production)

2. **Get Connection URL**:
   - Copy "External Database URL"
   - Format: `postgresql://username:password@hostname:port/database`

### Alternative: Neon (Serverless PostgreSQL)

1. Visit https://neon.tech
2. Create new project: "Sofeia AI"
3. Copy connection string from dashboard

## 🚀 Step 3: Web Service Deployment

### Deploy to Render

1. **Create Web Service**:
   - Dashboard → "New +" → "Web Service"
   - Connect GitHub repository
   - Select your `sofeia-ai` repo

2. **Configure Build**:
   - **Name**: `sofeia-ai-agent`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Auto-Deploy**: Yes (on push to main)

### Deploy to Railway

1. Visit https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Select repository
4. Railway auto-detects Node.js and builds

### Deploy to Vercel (Serverless)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔐 Step 4: Environment Variables

Set these in your deployment platform:

```bash
# Core Configuration
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database

# Session Security (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
SESSION_SECRET=your-64-character-random-string

# AI Service APIs
GROQ_API_KEY=gsk_your_groq_api_key_here
PERPLEXITY_API_KEY=pplx-your_perplexity_key_here
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here

# Payment Integration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Admin Controls (Pre-configured for Ottmar Francisca)
ADMIN_KEY=0f5db72a966a8d5f7ebae96c6a1e2cc574c2bf926c62dc4526bd43df1c0f42eb
ADMIN_IP_ADDRESS=112.198.165.82

# Optional: For Replit OAuth (if using)
REPLIT_DOMAINS=your-domain.com,your-app.onrender.com
REPL_ID=your-replit-app-id
```

### 🔑 API Key Setup Guide

#### Groq (General Questions - Fast)
1. Visit https://console.groq.com/keys
2. Create account (free tier: 14,000 requests/day)
3. Generate API key
4. Copy key starting with `gsk_`

#### Perplexity (Research & Citations)
1. Visit https://www.perplexity.ai/settings/api
2. Sign up (requires payment: ~$0.005 per request)
3. Generate API key
4. Copy key starting with `pplx-`

#### Anthropic (Content Generation)
1. Visit https://console.anthropic.com
2. Create account (free tier: $5 credit)
3. Go to "API Keys" → "Create Key"
4. Copy key starting with `sk-ant-`

#### PayPal (Credit Purchases)
1. Visit https://developer.paypal.com
2. Create app (sandbox for testing, live for production)
3. Copy Client ID and Secret
4. For testing: use sandbox credentials
5. For production: switch to live credentials

### Generate Secrets

```bash
# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate ADMIN_KEY (or use pre-configured)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Get your IP address
curl ifconfig.me
```

## 🎯 Step 5: Features Configuration

### Credit Purchase System

The app includes professional pricing cards:

- **Starter Plan**: €35/month for 150 questions
- **Professional Plan**: €300/month for 1500 questions

Both plans include:
- WhatsApp contact button (collects email + IP)
- PayPal direct payment button
- Professional bordeaux (#8B1538) styling

### Loading States System

Comprehensive loading experience:
- Landing page: Progressive messages while starting chat
- Home page: Service-specific loading (Groq, Perplexity, Anthropic)
- 3-4 second loading sequence with animated spinners

### Advanced AI Capabilities

**RankMath SEO Optimization (2-Credit Service)**:
- Complete integration of nel-media.com SEO guide
- Focus keyword strategy with power words
- URL optimization under 75 characters
- Meta descriptions under 160 characters
- H1/H2/H3 header hierarchy with keywords
- 1-2% keyword density optimization
- External dofollow links to high-authority sites
- Internal linking for SEO juice

**C.R.A.F.T Framework Implementation**:
- Cut the fluff: Value-driven, concise content
- Review & optimize: Fact-checked statistics, optimized keyword placement
- Add visuals: Data tables, comparison charts, structured lists
- Fact-check: Verified claims with .gov/.edu sources
- Trust-build: Author credentials, source transparency

**AI Search Engine Optimization**:
- Google AI Overview compatibility
- Featured snippet structure (position zero targeting)
- Voice search optimization with natural language patterns
- Semantic search signals (LSI keywords, topic clusters)
- E-E-A-T excellence (Expertise, Experience, Authoritativeness, Trustworthiness)

**Smart Country Detection**:
Automatically detects target countries and prioritizes:
- **India**: gov.in, nic.in, rbi.org.in, sebi.gov.in
- **USA**: .gov, fda.gov, cdc.gov, nih.gov, sec.gov
- **UK**: .gov.uk, nhs.uk, parliament.uk
- **12+ other countries** with official domains

## 🧪 Step 6: Testing Deployment

### 1. Basic Functionality Test

```bash
# Test API endpoint
curl -X POST https://your-app.com/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "sessionId": "test-123"}'
```

### 2. AI Services Test

Test each service type:

```javascript
// General Questions (Groq - 1 credit)
"What is artificial intelligence in 2025?"
// Should return HTML with H1, H2, H3, bullet points, copy-paste ready

// SEO Content (Anthropic - 2 credits)  
"Write RankMath SEO blog post about AI in healthcare"
// Should achieve 100/100 RankMath score with:
// - Focus keyword optimization
// - Proper H1, H2, H3 hierarchy  
// - Meta description under 160 chars
// - External dofollow links
// - 600-1000 words
// - C.R.A.F.T framework implementation

// Grant Writing (Anthropic - 3 credits)
"Help me write a grant proposal for AI research funding"
// Should ask: "Who is the applying organisation and who is awarding the grant?"
// Should return professional HTML with budget tables, timeline, citations
```

### 3. Credit Purchase Test

1. Visit landing page
2. Scroll to credit purchase cards
3. Test WhatsApp button (should collect email + IP)
4. Test PayPal button (should redirect to paypal.me/ojgmedia)

### 4. Admin Panel Test

1. Visit `https://your-app.com/admin`
2. Enter admin key: `0f5db72a966a8d5f7ebae96c6a1e2cc574c2bf926c62dc4526bd43df1c0f42eb`
3. Verify IP 112.198.165.82 has unlimited access
4. Test adding credits to IP addresses

## 🔧 Step 7: Custom Domain (Optional)

### Render Custom Domain

1. Service Settings → "Custom Domains"
2. Add domain: `sofeia-ai.com`
3. Update DNS:
   ```
   Type: CNAME
   Name: @
   Value: your-app.onrender.com
   ```

### Vercel Custom Domain

1. Project Settings → "Domains"
2. Add domain
3. Configure DNS as instructed

## 📊 Step 8: Monitoring & Analytics

### Essential Monitoring

1. **Error Tracking**: Monitor logs for API failures
2. **Performance**: Track response times
3. **Credits Usage**: Monitor per-IP consumption
4. **PayPal Integration**: Track payment success rates

### Render Monitoring

- Built-in metrics dashboard
- Email alerts for downtime
- Log streaming

### Custom Analytics

```javascript
// Add to your app for usage tracking
const analytics = {
  trackQuestion: (serviceType, credits) => {
    console.log(`Question: ${serviceType}, Credits: ${credits}`);
  },
  trackPurchase: (plan, amount) => {
    console.log(`Purchase: ${plan}, Amount: €${amount}`);
  }
};
```

## 💰 Cost Estimation

### Development/Testing
- **Render Web Service**: Free (750 hours/month)
- **PostgreSQL**: Free (90 days trial)
- **API Usage**: Free tiers
- **Total**: €0/month

### Production (Recommended)
- **Render Web Service**: €7/month
- **PostgreSQL**: €20/month  
- **Groq API**: €0 (generous free tier)
- **Perplexity API**: ~€50/month (moderate usage)
- **Anthropic API**: ~€30/month (moderate usage)
- **Total**: ~€107/month

### Revenue Potential
- **Starter Plans**: €35 × users/month
- **Professional Plans**: €300 × users/month
- **Break-even**: 4 customers/month

## 🚨 Troubleshooting

### Build Failures

```bash
# Common issues:
Error: Cannot find module 'xyz'
# Fix: npm install && git add package-lock.json && git commit -m "Update deps"

Error: Build command failed
# Fix: Check package.json build script matches deployment platform
```

### API Connection Issues

```bash
# Test API keys individually:
curl -H "Authorization: Bearer $GROQ_API_KEY" https://api.groq.com/openai/v1/models
curl -H "Authorization: Bearer $PERPLEXITY_API_KEY" https://api.perplexity.ai/chat/completions
curl -H "x-api-key: $ANTHROPIC_API_KEY" https://api.anthropic.com/v1/messages
```

### Database Connection

```bash
# Test database connection:
psql $DATABASE_URL -c "SELECT 1;"
```

### WebSocket Issues

Check that your deployment platform supports WebSocket connections:
- ✅ Render: Full WebSocket support
- ✅ Railway: Full WebSocket support  
- ❌ Vercel: Limited (use Server-Sent Events instead)

## 🔒 Security Checklist

- [ ] All API keys in environment variables (not code)
- [ ] SESSION_SECRET is strong (64+ characters)
- [ ] ADMIN_KEY is secure (32+ characters) 
- [ ] Database has restricted access
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] PayPal using live credentials for production
- [ ] IP address validation for admin access
- [ ] Input sanitization for all user inputs

## 📞 Support & Contact

**Founder**: Ottmar Francisca  
**WhatsApp**: +31 628 073 996  
**PayPal**: https://paypal.me/ojgmedia?country.x=NL&locale.x=en_US

**Admin Access**:
- **Key**: `0f5db72a966a8d5f7ebae96c6a1e2cc574c2bf926c62dc4526bd43df1c0f42eb`
- **IP**: `112.198.165.82` (Unlimited access)

## 📈 Scaling & Future Enhancements

### Immediate Optimizations
1. **CDN**: Add Cloudflare for global performance
2. **Caching**: Implement Redis for session storage
3. **Load Balancing**: Multiple service instances

### Feature Roadmap
1. **User Accounts**: Replace IP-based with user registration
2. **Subscription Management**: Automated billing cycles
3. **API Access**: Public API for developers
4. **Mobile App**: React Native version
5. **Multi-language**: Support for multiple languages

---

© 2025 Sofeia AI Agent • Built for autonomous AI interactions • Licensed under MIT

**Deploy with confidence** - This guide covers everything needed for a production-ready deployment of Sofeia AI Agent.