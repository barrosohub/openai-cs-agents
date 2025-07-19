# syntax=docker/dockerfile:1
## Builder stage: install deps and build the Next.js app
FROM node:22-alpine AS builder

# Install runtime dependencies for build
RUN apk add --no-cache libc6-compat curl && apk upgrade

WORKDIR /app

# Create non-root user for build steps
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

# Leverage Docker cache: install dependencies first
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Copy source and build
COPY --chown=nextjs:nodejs . .
RUN npm run build

## Runner stage: serve the built app in production mode
FROM node:22-alpine AS runner

WORKDIR /app

# Install curl for healthchecks
RUN apk add --no-cache curl

# Create non-root user for runtime
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy application files from builder
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/package-lock.json ./
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./

USER nextjs

EXPOSE 3000

# Simple healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Run Next.js in production mode
CMD ["npm", "run", "start"]
