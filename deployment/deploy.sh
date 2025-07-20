#!/bin/bash

# Sofeia AI Agent Deployment Script
# For GitHub deployment and verification

set -e

echo "🚀 Sofeia AI Agent Deployment Script"
echo "===================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp .env.example .env
    print_error "Please edit .env file with your API keys before proceeding!"
    exit 1
fi

print_status "Environment file found"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ required. Current version: $(node --version)"
    exit 1
fi

print_status "Node.js version check passed"

# Install dependencies
print_status "Installing dependencies..."
npm install

# TypeScript check
print_status "Running TypeScript check..."
npm run check

# Build application
print_status "Building application..."
npm run build

# Check if build artifacts exist
if [ ! -f "dist/index.js" ]; then
    print_error "Build failed - dist/index.js not found"
    exit 1
fi

if [ ! -d "dist/public" ]; then
    print_error "Build failed - dist/public not found"
    exit 1
fi

print_status "Build artifacts verified"

# Check environment variables
print_status "Checking required environment variables..."

source .env

required_vars=(
    "DATABASE_URL"
    "SESSION_SECRET"
    "GROQ_API_KEY"
    "PERPLEXITY_API_KEY" 
    "ANTHROPIC_API_KEY"
    "PAYPAL_CLIENT_ID"
    "PAYPAL_CLIENT_SECRET"
    "ADMIN_KEY"
    "ADMIN_IP_ADDRESS"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

print_status "All required environment variables found"

# Test API keys (optional)
print_status "Testing API connections..."

# Test Groq API
if ! curl -s -H "Authorization: Bearer $GROQ_API_KEY" https://api.groq.com/openai/v1/models > /dev/null 2>&1; then
    print_warning "Groq API test failed - check GROQ_API_KEY"
else
    print_status "Groq API connection verified"
fi

# Test database connection (if local)
if [[ $DATABASE_URL == *"localhost"* ]]; then
    print_status "Running database migration..."
    npm run db:push
fi

print_status "All checks passed!"

echo ""
echo "🎉 Deployment ready!"
echo ""
echo "Next steps:"
echo "1. For local testing: npm run dev"
echo "2. For production: npm start"
echo "3. For Docker: docker-compose up"
echo "4. For Render: Push to GitHub and deploy"
echo ""
echo "📞 Support: +31 628 073 996 (WhatsApp)"
echo "💳 PayPal: https://paypal.me/ojgmedia"
echo "🔑 Admin: http://localhost:5000/admin (Key: $ADMIN_KEY)"
echo ""
echo "© 2025 Sofeia AI Agent by Ottmar Francisca"