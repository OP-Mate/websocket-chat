# --- Build stage ---
FROM node:22.14.0-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json server/
COPY shared/package.json shared/

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile --prod

COPY server ./server
COPY shared ./shared

RUN pnpm --filter server run build

# --- Runtime stage ---
FROM node:22.14.0-alpine AS runner

WORKDIR /app

# Copy built output and manifests
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod

# CMD ["tail", "-f", "/dev/null"]
# CMD ["ls", "-l", "/app"]
CMD ["node", "dist/index.js"]


