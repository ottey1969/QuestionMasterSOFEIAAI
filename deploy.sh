#!/bin/bash

# Sofeia AI Agent - Quick Deployment Script
# © 2025 Ottmar Francisca

echo "🚀 Deploying Sofeia AI Agent with Smart Country Detection..."

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
echo "🌟 Sofeia AI Agent Features:"
echo "   • Smart Country Detection (12+ countries)"
echo "   • IP-Based Credit System (5 questions per IP)"
echo "   • Multi-AI Integration (Groq, Perplexity, Anthropic)"
echo "   • Admin Panel at /admin"
echo "   • Real-time Chat with WebSocket"
echo ""
echo "📱 Admin Contact: +31 628 073 996"
echo "💝 Support: https://paypal.me/ojgmedia?country.x=NL&locale.x=en_US"
echo ""
echo "🎉 Ready to serve intelligent AI responses!"