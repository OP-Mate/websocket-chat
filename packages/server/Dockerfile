FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Build stage
FROM base AS build
WORKDIR /usr/src/app
COPY packages/shared ./packages/shared
COPY packages/server ./packages/server
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
RUN pnpm --filter chat-shared run build
RUN pnpm --filter chat-server run build

# Production deps stage
FROM base AS prod-deps
WORKDIR /app
COPY --from=build /usr/src/app/packages/server/package.json ./packages/server/package.json
COPY --from=build /usr/src/app/pnpm-lock.yaml ./
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Final runtime stage
FROM base AS server
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules

COPY --from=build /usr/src/app/packages/shared/dist ./packages/shared/dist
COPY --from=build /usr/src/app/packages/shared/package.json ./packages/shared/package.json
COPY --from=build /usr/src/app/packages/shared/node_modules ./packages/shared/node_modules

COPY --from=build /usr/src/app/packages/server/dist ./packages/server/dist
COPY --from=build /usr/src/app/packages/server/package.json ./packages/server/package.json
COPY --from=build /usr/src/app/packages/server/node_modules ./packages/server/node_modules

CMD ["node", "packages/server/dist/index.js"]