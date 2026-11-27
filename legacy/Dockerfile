# Use Node.js 20 as the base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when package.json changes
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Build the app
FROM deps AS builder
COPY . .
# Set build-time environment variables to prevent auth route errors
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV=production
# Force the build to skip dynamic route generation for auth routes
RUN npm run build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy built NextJS from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]