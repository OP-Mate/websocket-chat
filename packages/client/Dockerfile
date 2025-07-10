FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app
COPY packages/shared ./packages/shared
COPY packages/client ./packages/client
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
RUN pnpm --filter chat-shared run build
RUN pnpm --filter chat-client run build

FROM nginx:alpine AS client
COPY --from=build /usr/src/app/packages/client/dist /usr/share/nginx/html
EXPOSE 80
