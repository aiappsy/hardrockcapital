# Multi-stage Dockerfile for Node.js application

# Stage 1: Base
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage 2: Dependencies
FROM base AS dependencies
RUN npm install --omit=dev

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application code
COPY server ./server
COPY public ./public
COPY package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["node", "server/server.js"]
