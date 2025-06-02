# Multi-stage build for Node.js backend
FROM node:18-alpine AS base

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/

# Install dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY apps/server ./apps/server
RUN cd apps/server && pnpm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Create app user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 dsl-user

# Copy built application
COPY --from=build --chown=dsl-user:nodejs /app/apps/server/dist ./dist
COPY --from=build --chown=dsl-user:nodejs /app/apps/server/package.json ./
COPY --from=deps --chown=dsl-user:nodejs /app/apps/server/node_modules ./node_modules

# Create chroma directory for vector database
RUN mkdir -p /app/chroma && chown dsl-user:nodejs /app/chroma

# Switch to non-root user
USER dsl-user

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/index.js"] 