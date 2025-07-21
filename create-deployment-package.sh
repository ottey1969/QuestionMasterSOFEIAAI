#!/bin/bash

# Sofeia AI Agent - Deployment Package Creator
# Creates a complete deployment package for GitHub and TAR distribution

echo "📦 Creating Sofeia AI Agent v2025 Deployment Package..."
echo "🏆 Features: RankMath SEO, C.R.A.F.T Framework, AI Search Engine Optimization"

# Create deployment directory
mkdir -p deployment-package
cd deployment-package

# Copy essential files
cp ../package.json .
cp ../package-lock.json .
cp ../tsconfig.json .
cp ../vite.config.ts .
cp ../tailwind.config.ts .
cp ../postcss.config.js .
cp ../components.json .
cp ../drizzle.config.ts .
cp ../README.md .
cp ../.env.example .
cp ../.gitignore .

# Copy deployment files
cp ../GITHUB_DEPLOYMENT.md .
cp ../render.yaml .
cp ../deploy.sh .
cp ../DEPLOYMENT.md .
cp ../QUICK_DEPLOYMENT.md .

# Copy source directories
cp -r ../client .
cp -r ../server .
cp -r ../shared .

# Create deployment info
cat > DEPLOYMENT_INFO.txt << EOF
SOFEIA AI AGENT v2025 - DEPLOYMENT PACKAGE
=========================================

📅 Package Created: $(date)
👨‍💼 Founder: Ottmar Francisca
📞 Contact: +31 628 073 996
💳 PayPal: https://paypal.me/ojgmedia

🚀 FEATURES INCLUDED:
✅ RankMath SEO Optimization (100/100 score protocol)
✅ C.R.A.F.T Framework Implementation
✅ AI Search Engine Optimization (Google AI Overview, Voice Search)
✅ Elite AI Integration (Groq, Perplexity, Anthropic)
✅ HTML Structure (H1, H2, H3, H4 headers, active links, tables)
✅ Smart Country Detection (12+ countries)
✅ Professional Credit System (€35/month, €300/month)
✅ Real-time WebSocket Chat
✅ Copy-Paste Ready Output (CMS, Docs, Notion)

🔧 DEPLOYMENT OPTIONS:
1. GitHub → Read GITHUB_DEPLOYMENT.md
2. Render → Use render.yaml (one-click deploy)
3. Manual → Run deploy.sh script

🔐 REQUIRED ENVIRONMENT VARIABLES:
- DATABASE_URL (PostgreSQL connection)
- GROQ_API_KEY (General questions)
- PERPLEXITY_API_KEY (Research)
- ANTHROPIC_API_KEY (SEO & Grant writing)
- PAYPAL_CLIENT_ID & PAYPAL_CLIENT_SECRET
- SESSION_SECRET (64-character random string)

🏆 ADMIN ACCESS (PRE-CONFIGURED):
- IP: 112.198.165.82 (Unlimited credits)
- Admin Key: 0f5db72a966a8d5f7ebae96c6a1e2cc574c2bf926c62dc4526bd43df1c0f42eb

📊 CREDIT SYSTEM:
- 1 Credit: General Knowledge (Groq)
- 2 Credits: SEO Content (RankMath optimized)
- 3 Credits: Grant Writing (Professional proposals)
- 5 Free questions per IP address

🎯 TARGET AUDIENCE:
- Content creators
- SEO professionals
- Grant writers
- Business owners
- Digital marketers

© 2025 Sofeia AI Agent - Built for autonomous AI interactions
EOF

echo "✅ Deployment package created in deployment-package/"
echo "📄 Files included:"
echo "   • Source code (client, server, shared)"
echo "   • Deployment guides (GitHub, Render, Manual)"
echo "   • Configuration files"
echo "   • README and documentation"
echo ""
echo "🚀 Ready for:"
echo "   • GitHub repository upload"
echo "   • TAR.GZ distribution"
echo "   • One-click Render deployment"
echo "   • Manual server deployment"