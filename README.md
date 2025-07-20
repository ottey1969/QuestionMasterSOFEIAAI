# Sofeia AI Agent

The world's most advanced autonomous AI system, combining multi-agent reasoning, real-time research, and enterprise-grade security to revolutionize AI interactions.

## Features

- **Multi-AI Integration**: Powered by Groq, Perplexity, and Anthropic APIs
- **Intelligent Routing**: Automatically selects the best AI service based on query type
- **Real-time Chat**: WebSocket-based communication with loading states
- **Professional Formatting**: HTML-rendered responses with headings, bullets, and copy functions
- **Three Specialized Services**:
  - General Questions (Groq llama3-8b-8192) - 1 credit
  - SEO & AI Content (Perplexity + Anthropic Claude-4-Sonnet) - 2 credits
  - Grant Writing (Anthropic Claude-4-Sonnet) - 3 credits

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, WebSocket
- **Database**: PostgreSQL with Drizzle ORM
- **Payment**: PayPal integration
- **Build**: Vite, esbuild

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- API keys for:
  - Groq (free at console.groq.com)
  - Perplexity (api.perplexity.ai)
  - Anthropic (console.anthropic.com)
  - PayPal (developer.paypal.com)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd sofeia-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and database URL

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-session-secret
GROQ_API_KEY=your-groq-api-key
PERPLEXITY_API_KEY=your-perplexity-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

## Deployment

### Render Deployment

1. **Create Render Account**: Sign up at render.com
2. **Create PostgreSQL Database**: In Render dashboard, create a new PostgreSQL database
3. **Create Web Service**: Connect your GitHub repository and configure:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment Variables: Add all required API keys
4. **Deploy**: Push to main branch to trigger deployment

See detailed deployment guide in `DEPLOYMENT.md`.

## API Endpoints

- `POST /api/chat/message` - Send message to AI
- `GET /api/user/session` - Create anonymous session
- `GET /api/status` - Service health check
- `POST /api/paypal/*` - PayPal payment endpoints
- WebSocket `/ws` - Real-time chat

## Credits System

- General Questions: 1 credit
- Research Queries: 1 credit  
- SEO Content: 2 credits
- Grant Writing: 3 credits

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

© 2025 Sofeia AI Agent • Founder/CEO: Ottmar Francisca

## Contact

- **Founder/CEO**: Ottmar Francisca
- **WhatsApp**: +31 628 073 996
- **Support**: https://paypal.me/ojgmedia?country.x=NL&locale.x=en_US
- **Website**: Deploy to your domain via Render/Vercel/Netlify