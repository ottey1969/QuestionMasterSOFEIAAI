# Sofeia AI Agent

> **The World's Most Advanced Autonomous AI Agent**

A production-ready AI-powered platform featuring multi-AI integration, professional credit purchase system, and intelligent country-specific research capabilities.

![Sofeia AI Agent](https://img.shields.io/badge/AI-Agent-blue?style=for-the-badge) ![Status](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## ✨ Features

### 🤖 Multi-AI Integration
- **General Questions**: Groq API with Mixtral for lightning-fast responses (1 credit)
- **Research & Citations**: Perplexity API with smart country targeting (1 credit)  
- **SEO Content**: Perplexity research + Anthropic content generation (2 credits)
- **Grant Writing**: Anthropic Claude-4-Sonnet for professional proposals (3 credits)

### 💳 Professional Credit System
- **Starter Plan**: €35/month for 150 questions
- **Professional Plan**: €300/month for 1500 questions  
- WhatsApp integration for admin contact (+31 628 073 996)
- Direct PayPal integration (https://paypal.me/ojgmedia)
- Real-time email and IP collection

### 🌍 Smart Country Detection
Automatically prioritizes government and high-authority sources:
- **India**: gov.in, nic.in, rbi.org.in, sebi.gov.in
- **USA**: .gov, fda.gov, cdc.gov, nih.gov, sec.gov
- **UK**: .gov.uk, nhs.uk, parliament.uk
- **12+ countries** with official domain targeting

### 🚀 Modern Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + WebSocket support
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: IP-based with admin controls
- **UI**: Radix UI + shadcn/ui components
- **Real-time**: WebSocket-based chat with comprehensive loading states

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- API keys: Groq, Perplexity, Anthropic, PayPal

### Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/sofeia-ai.git
cd sofeia-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Initialize database
npm run db:push

# Start development server
npm run dev
```

Visit http://localhost:5000 to see the application.

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/sofeia_ai

# Session Security
SESSION_SECRET=your-64-character-random-string

# AI APIs
GROQ_API_KEY=gsk_your_groq_api_key
PERPLEXITY_API_KEY=pplx-your_perplexity_key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key

# Payment
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Admin (Pre-configured for Ottmar Francisca)
ADMIN_KEY=0f5db72a966a8d5f7ebae96c6a1e2cc574c2bf926c62dc4526bd43df1c0f42eb
ADMIN_IP_ADDRESS=112.198.165.82
```

## 🚀 Deployment

### One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yourusername/sofeia-ai)

### Manual Deployment

See our comprehensive deployment guides:
- [GitHub Deployment Guide](GITHUB_DEPLOYMENT.md) - Complete setup guide
- [Quick Deployment](QUICK_DEPLOYMENT.md) - 5-minute setup
- [Original Deployment Guide](DEPLOYMENT.md) - Detailed walkthrough

### Docker Deployment

```bash
# Build image
docker build -t sofeia-ai .

# Run container
docker run -p 5000:5000 --env-file .env sofeia-ai
```

## 📖 Usage

### For Users
1. Visit the landing page
2. Choose a credit plan (Starter €35 or Professional €300)
3. Contact admin via WhatsApp or pay through PayPal
4. Start chatting with the AI agent
5. Select service type: General, SEO Content, or Grant Writing

### For Developers
```javascript
// API endpoint for chat
POST /api/chat/message
{
  "message": "Your question here",
  "sessionId": "unique-session-id"
}

// WebSocket connection
const ws = new WebSocket('ws://localhost:5000/ws');
ws.send(JSON.stringify({
  type: 'chat',
  content: 'Your message',
  sessionId: 'session-id'
}));
```

### Admin Panel
- URL: `/admin`
- Key: `0f5db72a966a8d5f7ebae96c6a1e2cc574c2bf926c62dc4526bd43df1c0f42eb`
- Features: IP management, credit allocation, usage analytics

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server  │◄──►│  PostgreSQL DB  │
│                 │    │                  │    │                 │
│ • Tailwind CSS  │    │ • WebSocket      │    │ • User sessions │
│ • React Query   │    │ • AI routing     │    │ • Credit system │
│ • Wouter        │    │ • Rate limiting  │    │ • Admin logs    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   AI Services   │
                    │                 │
                    │ • Groq          │
                    │ • Perplexity    │
                    │ • Anthropic     │
                    │ • PayPal        │
                    └─────────────────┘
```

## 🎨 Screenshots

### Landing Page with Credit Purchase
Professional pricing cards with WhatsApp and PayPal integration

### AI Chat Interface  
Real-time chat with comprehensive loading states and HTML-formatted responses

### Admin Panel
IP-based credit management and usage analytics

## 🔧 Configuration

### AI Service Configuration

The app intelligently routes requests based on content analysis:

```typescript
// Service routing logic
const serviceType = analyzeMessage(message);
switch(serviceType) {
  case 'general': return await groqService.process(message);
  case 'research': return await perplexityService.process(message);
  case 'seo': return await generateSEOContent(message);
  case 'grant': return await anthropicService.processGrant(message);
}
```

### Country Detection

```typescript
const countries = detectCountries(message);
const sources = prioritizeSources(countries);
// Automatically targets government domains
```

## 📊 Analytics & Monitoring

- Real-time credit usage tracking
- IP-based analytics
- Payment conversion metrics
- AI service performance monitoring
- Admin dashboard with comprehensive logs

## 🛡️ Security

- IP-based access control
- Session-based authentication  
- Environment variable security
- Rate limiting and abuse prevention
- Admin IP whitelist (112.198.165.82)
- Secure PayPal integration

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

**Founder**: Ottmar Francisca  
**WhatsApp**: +31 628 073 996  
**PayPal**: https://paypal.me/ojgmedia?country.x=NL&locale.x=en_US

**Admin Access**:
- **Panel**: `/admin`  
- **Key**: `0f5db72a966a8d5f7ebae96c6a1e2cc574c2bf926c62dc4526bd43df1c0f42eb`
- **IP**: `112.198.165.82` (Unlimited access)

## 🚀 Roadmap

- [ ] User account system
- [ ] Subscription management
- [ ] Mobile app (React Native)
- [ ] API for developers
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] White-label solutions
- [ ] Enterprise features

## 🏆 Acknowledgments

- **AI Providers**: Groq, Perplexity, Anthropic
- **Payment**: PayPal integration
- **UI Components**: Radix UI, shadcn/ui
- **Infrastructure**: Render, PostgreSQL

---

© 2025 Sofeia AI Agent • Built for autonomous AI interactions

**Star this repo** if you find it useful! ⭐