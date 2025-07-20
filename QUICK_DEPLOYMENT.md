# Quick Deployment Guide - Sofeia AI Agent

Deploy Sofeia AI Agent with smart country detection in 5 minutes.

## One-Click Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## Environment Variables Required

Set these in your deployment platform:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Session Security
SESSION_SECRET=your-64-char-random-string

# AI APIs
GROQ_API_KEY=your-groq-api-key
PERPLEXITY_API_KEY=your-perplexity-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Payment Integration
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Admin Controls
ADMIN_KEY=your-32-char-admin-key
ADMIN_IP_ADDRESS=your-ip-address-for-unlimited-access
```

## Generate Secrets

```bash
# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate ADMIN_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Get your IP address
curl ifconfig.me
# Example: 112.198.165.82
```

## Quick Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Start Production
npm start

# Database Setup
npm run db:push

# Deploy with script
./deploy.sh
```

## Features Ready After Deployment

### Smart Country Detection
- Automatically detects target countries from queries
- Prioritizes relevant government sources:
  - India: gov.in, nic.in, rbi.org.in, sebi.gov.in
  - USA: gov, fda.gov, cdc.gov, nih.gov, sec.gov
  - UK: gov.uk, nhs.uk, parliament.uk
  - 12+ countries supported

### IP-Based Credit System
- 5 questions per IP without registration
- Real-time credit tracking
- WhatsApp contact when exhausted
- Admin panel at `/admin` for credit management

### Multi-AI Integration
- **General Questions**: Groq (1 credit)
- **Research & Citations**: Perplexity with country targeting (1 credit)
- **SEO Content**: Perplexity + Anthropic (2 credits)
- **Grant Writing**: Anthropic (3 credits)

## Testing After Deployment

1. **Basic Function**: Visit your URL, should see landing page
2. **Chat Interface**: Click "Start Chatting", test WebSocket connection
3. **Country Detection**: Try "Content for India" → Should prioritize Indian sources
4. **Credit System**: Make 5 questions, verify credit deduction
5. **Admin Panel**: Visit `/admin`, login with ADMIN_KEY

## Support

- **Founder**: Ottmar Francisca
- **WhatsApp**: +31 628 073 996
- **Donations**: https://paypal.me/ojgmedia?country.x=NL&locale.x=en_US

## One-Minute Test

```bash
# Test country detection
curl -X POST https://your-app.com/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Find regulations in India", "sessionId": "test"}'

# Should return response with Indian government sources (gov.in, nic.in, etc.)
```

© 2025 Sofeia AI Agent • Built for global content creators