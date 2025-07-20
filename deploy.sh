#!/bin/bash

# Sofeia AI Agent - Production Deployment Script
# © 2025 Ottmar Francisca - CEO/Founder
# Contact: +31 628 073 996

echo "🚀 Deploying Sofeia AI Agent with Smart Country Detection..."
echo "👨‍💼 Founder: Ottmar Francisca"
echo "🌍 Features: 12+ Country Targeting, IP-Based Credits, Multi-AI Integration"

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is not set"
  exit 1
fi

if [ -z "$GROQ_API_KEY" ]; then
  echo "❌ GROQ_API_KEY is not set"
  exit 1
fi

if [ -z "$PERPLEXITY_API_KEY" ]; then
  echo "❌ PERPLEXITY_API_KEY is not set"
  exit 1
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "❌ ANTHROPIC_API_KEY is not set"
  exit 1
fi

echo "✅ Environment variables verified"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build frontend
echo "🏗️ Building frontend..."
npm run build:frontend

# Build backend
echo "🏗️ Building backend..."
npm run build:backend

# Push database schema
echo "🗄️ Setting up database schema..."
npm run db:push

echo "✅ Deployment complete!"
echo ""
echo "🌟 Sofeia AI Agent - Production Ready!"
echo "   ✅ Smart Country Detection (12+ countries with government sources)"
echo "   ✅ IP-Based Credit System (5 questions per IP, unlimited for admin)"
echo "   ✅ Multi-AI Integration (Groq, Perplexity, Anthropic)"
echo "   ✅ Admin Panel at /admin"
echo "   ✅ Real-time Chat with WebSocket"
echo "   ✅ HTML Formatted Responses with Copy Functions"
echo "   ✅ Government Source Prioritization"
echo ""
echo "🔐 Admin Access:"
echo "   • IP: 112.198.165.82 (Ottmar Francisca - Unlimited Credits)"
echo "   • Admin Key: 0f5db...42eb"
echo ""
echo "📱 Contact: +31 628 073 996 (WhatsApp)"
echo "💝 Support: https://paypal.me/ojgmedia?country.x=NL&locale.x=en_US"
echo ""
echo "🎉 Sofeia AI Agent is now live and ready to serve global content creators!"