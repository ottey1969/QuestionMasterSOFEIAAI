# Multi-stage build for Sofeia AI Agent
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client and build application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sofeia

# Copy built application
COPY --from=builder --chown=sofeia:nodejs /app/dist ./dist
COPY --from=deps --chown=sofeia:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sofeia:nodejs /app/package.json ./package.json

USER sofeia

EXPOSE 5000

ENV PORT=5000

CMD ["npm", "start"]