# --- Build stage ---
FROM node:22.14.0-alpine AS builder

WORKDIR /app

# Copy root and workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json server/

# Install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY server ./server

# Build the server
RUN pnpm --filter chat-server run build

# --- Runtime stage ---
FROM node:22.14.0-alpine AS runner

WORKDIR /app

# Copy built output and only what's needed for production
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN ls -l /app || echo "no app in /app"
RUN ls -l /app/server || echo "no server in /app/server"
RUN ls -l /app/server/dist || echo "No dist in /app/server"
RUN ls -l /app/dist || echo "No dist in /app"

# Install only production dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --no-frozen-lockfile

# Start the server
CMD ["node", "dist/index.js"]