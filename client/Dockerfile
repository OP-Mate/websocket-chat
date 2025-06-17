# --- Build stage ---
FROM node:22.14.0-alpine AS builder

WORKDIR /app

RUN rm -rf ./client/dist

RUN corepack enable && corepack prepare pnpm@latest --activate


COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY client/package.json client/pnpm.* client/
COPY shared/package.json shared/pnpm.* shared/
COPY server/package.json server/pnpm.* server/

RUN pnpm install --frozen-lockfile

COPY client ./client
COPY shared ./shared

RUN mkdir -p client/dist

# Build
RUN pnpm --filter client run build && ls -la ./client/dist

# --- Serve stage ---
FROM nginx:alpine

COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
