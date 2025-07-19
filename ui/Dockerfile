# syntax=docker/dockerfile:1
FROM node:22-alpine

# Metadata
LABEL org.opencontainers.image.title="Next.js Frontend" \
      org.opencontainers.image.description="Next.js development frontend" \
      org.opencontainers.image.authors="your-email@company.com" \
      org.opencontainers.image.version="1.0.0"

# Install dependencies necessárias
RUN apk add --no-cache \
    libc6-compat \
    curl && \
    apk upgrade

WORKDIR /app

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy package files PRIMEIRO para melhor cache
COPY package.json package-lock.json ./

# Install ALL dependencies (incluindo dev para desenvolvimento)
RUN npm ci && \
    npm cache clean --force

# Copy source code com ownership correto
COPY --chown=nextjs:nodejs . .

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Health check SIMPLES que funciona
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Comando padrão Next.js
CMD ["npm", "run", "dev"]
