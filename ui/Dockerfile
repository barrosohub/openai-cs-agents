FROM node:22-alpine AS base

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

FROM base AS dev

COPY package*.json ./
RUN npm ci

COPY . .

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "dev:next"]
