# 🤖 Sofeia AI Agent v2025 - Production Ready

**The World's Most Advanced Autonomous AI Agent Platform**

> Complete AI-powered solution featuring real-time research, professional content generation, and grant writing with C.R.A.F.T framework optimization.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yourusername/sofeia-ai)

## 🚀 Features

### 🧠 Advanced AI Integration
- **Groq API** (1 credit) - Lightning-fast general questions with step-by-step reasoning
- **Perplexity API** (2 credits) - Live research with smart country detection for government sources
- **Anthropic Claude** (2-3 credits) - Professional content generation and grant writing

### 📈 Professional SEO & Content
- **RankMath Optimization** - Achieve 100/100 scores with proper HTML structure
- **C.R.A.F.T Framework** - Cut fluff, Review, Add visuals, Fact-check, Trust-build
- **AI Search Engine Ready** - Google AI Overview, Featured Snippets, Voice Search optimization
- **E-E-A-T Excellence** - Expertise, Experience, Authoritativeness, Trustworthiness signals

### 💰 Professional Credit System
- **Starter Plan**: €35/month for 150 questions
- **Professional Plan**: €300/month for 1500 questions
- **IP-Based Access**: 5 free questions per IP address
- **PayPal Integration**: Direct payment processing

### 🌍 Smart Country Detection
Automatically prioritizes official government sources:
- **India**: gov.in, nic.in, rbi.org.in, sebi.gov.in
- **USA**: .gov, fda.gov, cdc.gov, nih.gov, sec.gov
- **UK**: .gov.uk, nhs.uk, parliament.uk
- **12+ other countries** with official domain targeting

### 🔧 Technical Excellence
- **React 18** + **TypeScript** frontend with Vite
- **Express.js** backend with WebSocket real-time chat
- **PostgreSQL** database with Drizzle ORM
- **Comprehensive Loading States** with service-specific animations
- **Admin Controls** with IP-based unlimited access

## 📋 Quick Deploy

### 1. One-Click Deploy (Recommended)

#### Deploy to Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yourusername/sofeia-ai)

#### Deploy to Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/github.com/yourusername/sofeia-ai)

### 2. Manual Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/sofeia-ai.git
cd sofeia-ai

# Install dependencies
npm install

# Set environment variables (see .env.example)
cp .env.example .env
# Edit .env with your API keys and database URL

# Build and start
npm run build
npm start
```

## 🔐 Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
# Core Configuration
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-64-character-random-string

# AI Service APIs
GROQ_API_KEY=gsk_your_groq_api_key
PERPLEXITY_API_KEY=pplx-your_perplexity_key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key

# Payment Integration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Pre-configured Admin Access
ADMIN_KEY=0f5db72a966a8d5f7ebae96c6a1e2cc574c2bf926c62dc4526bd43df1c0f42eb
ADMIN_IP_ADDRESS=112.198.165.82
```

### 🔑 API Key Setup

1. **Groq** (Free tier available)
   - Visit: https://console.groq.com/keys
   - Free: 14,000 requests/day

2. **Perplexity** (Paid service)
   - Visit: https://www.perplexity.ai/settings/api
   - Cost: ~$0.005 per request

3. **Anthropic** (Free tier + paid)
   - Visit: https://console.anthropic.com
   - Free: $5 credit, then $3-15 per million tokens

4. **PayPal** (Business account)
   - Visit: https://developer.paypal.com
   - Create app and copy Client ID/Secret

## 📊 Service Examples

### General Questions (1 Credit)
```
Input: "Explain artificial intelligence in 2025"
Output: Comprehensive HTML with H1, H2, H3 headers, bullet points, copy-paste ready content
```

### SEO Content (2 Credits)
```
Input: "Write RankMath SEO blog post about AI in healthcare"
Output: 
- 100/100 RankMath score optimization
- Focus keyword strategy with power words  
- Proper H1, H2, H3 hierarchy
- Meta description under 160 characters
- External dofollow links to high-authority sites
- 600-1000 words with C.R.A.F.T framework
```

### Grant Writing (3 Credits)
```
Input: "Help me write a grant proposal for AI research funding"
Clarification: Asks for applying organization and funding body
Output:
- Professional HTML with budget tables
- Timeline and impact evaluation
- Official citations (.gov/.edu sources)
- SMART objectives and methodology
```

## 🏗️ Architecture

```
sofeia-ai/
├── client/               # React frontend
│   ├── src/
│   │   ├── pages/       # Landing, Chat, Admin, NotFound
│   │   ├── components/  # UI components
│   │   └── lib/         # Query client, utilities
├── server/              # Express backend
│   ├── services/        # AI router, security, prompts
│   ├── routes.ts        # API endpoints + WebSocket
│   ├── storage.ts       # Database operations
│   └── index.ts         # Server entry point
├── shared/              # Shared schemas and types
└── deployment/          # Deployment configurations
```

## 💰 Cost & Revenue

### Operating Costs (Monthly)
- **Hosting**: €7-20 (Render/Railway)
- **Database**: €0-20 (PostgreSQL)
- **API Usage**: €35-80 (Groq free, Perplexity + Anthropic)
- **Total**: ~€42-120/month

### Revenue Potential
- **Starter Plan**: €35/month per customer
- **Professional Plan**: €300/month per customer
- **Break-even**: 2-4 customers/month

## 🧪 Testing

### API Test
```bash
curl -X POST https://your-app.com/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "sessionId": "test-123"}'
```

### Admin Panel
1. Visit `/admin`
2. Enter admin key: `0f5db72a966a8d5f7ebae96c6a1e2cc574c2bf926c62dc4526bd43df1c0f42eb`
3. Verify unlimited access for IP: `112.198.165.82`

## 🔧 Development

```bash
# Development server
npm run dev

# Type checking
npm run check

# Database schema push
npm run db:push

# Build for production
npm run build
```

## 📞 Support & Contact

**Founder**: Ottmar Francisca  
**WhatsApp**: +31 628 073 996  
**PayPal**: https://paypal.me/ojgmedia

**Admin Access**:
- **Key**: `0f5db72a966a8d5f7ebae96c6a1e2cc574c2bf926c62dc4526bd43df1c0f42eb`
- **IP**: `112.198.165.82` (Unlimited)

## 📄 License

MIT License - see LICENSE file for details.

---

**Deploy with confidence** - Complete production-ready AI agent platform with professional credit system and advanced SEO optimization.