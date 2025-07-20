# replit.md

## Overview

This is a full-stack web application built as an autonomous AI agent platform called "Sofeia AI". The application provides AI-powered services including general question answering, SEO content generation, and grant writing. It features a React frontend with a Node.js/Express backend, PostgreSQL database integration, and multiple AI service integrations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful API with WebSocket support for real-time chat
- **Authentication**: Replit OAuth integration with session-based auth
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with migrations support
- **Schema**: Shared schema definition for type safety across frontend/backend
- **Key Tables**: users, sessions, creditTransactions, aiRequests, chatMessages, securityLogs

## Key Components

### AI Service Integrations
1. **General Questions**: Groq API with Mixtral model for fast responses
2. **Research & Citations**: Perplexity API with smart country detection and targeting of region-specific government sources (India: gov.in, nic.in, rbi.org.in; USA: .gov, fda.gov, cdc.gov; UK: .gov.uk, nhs.uk; and 10+ other countries)
3. **SEO Content**: Perplexity API for research + Anthropic Claude for content generation
4. **Grant Writing**: Anthropic Claude API for professional proposal writing

### Authentication & Security
- Replit OAuth integration for seamless authentication
- Session-based authentication with PostgreSQL storage
- Security monitoring with IP tracking and risk assessment
- User fingerprinting for fraud detection

### Credit System
- Token-based credit system for AI service usage
- PayPal integration for credit purchases
- Transaction tracking and history
- Admin controls for credit management

### Real-time Features
- WebSocket-based chat system
- Live admin support functionality
- Real-time credit updates

## Data Flow

### Authentication Flow
1. User clicks login → Redirects to Replit OAuth
2. OAuth callback → Creates/updates user session
3. Frontend receives authenticated user data
4. Protected routes become accessible

### AI Service Flow
1. User selects service type and enters input
2. Frontend validates input and checks user credits
3. Backend processes request through appropriate AI service
4. Credits deducted, request logged, response returned
5. Frontend displays formatted results with citations

### Payment Flow
1. User selects credit package
2. PayPal button initiates order creation
3. Backend creates PayPal order via API
4. User completes payment
5. Backend captures payment and adds credits
6. Frontend updates credit display

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless
- **Authentication**: Replit OAuth service
- **AI Services**: 
  - Groq API (general questions)
  - Perplexity API (research)
  - Anthropic Claude API (content generation)
- **Payment**: PayPal Server SDK
- **WebSocket**: Native WebSocket for real-time chat

### Development Dependencies
- **Build**: Vite with React plugin
- **Database**: Drizzle Kit for migrations
- **TypeScript**: Strict type checking enabled
- **Styling**: PostCSS with Tailwind CSS

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPLIT_DOMAINS`: Allowed domains for OAuth
- `PAYPAL_CLIENT_ID` & `PAYPAL_CLIENT_SECRET`: PayPal integration
- `GROQ_API_KEY`: Groq AI service
- `PERPLEXITY_API_KEY`: Perplexity research service
- `ANTHROPIC_API_KEY`: Claude AI service
- `ADMIN_KEY`: Admin panel access for credit management
- `ADMIN_IP_ADDRESS`: Founder's IP (112.198.165.82) for unlimited access

## Deployment Strategy

### Development
- Vite dev server for frontend hot reloading
- tsx for TypeScript execution in development
- Automatic Replit integration with banner and cartographer

### Production Build
- Vite builds optimized React bundle to `dist/public`
- esbuild compiles server TypeScript to `dist/index.js`
- Single command deployment: `npm run build && npm start`

### Database Management
- Drizzle migrations for schema versioning
- `npm run db:push` for development schema updates
- Production migrations through Drizzle Kit

### Security Considerations
- Session-only authentication (no JWTs)
- HTTPS enforcement in production
- Rate limiting and security monitoring
- Input validation with Zod schemas
- Parameterized database queries via Drizzle ORM

The application is designed for scalability with serverless PostgreSQL, stateless session management, and modular AI service integrations that can be easily extended or replaced.