FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build


FROM node:24-slim AS server
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --from=build /usr/src/app/node_modules. ./node_modules
COPY --from=build /usr/src/app/server ./server
COPY --from=build /usr/src/app/shared ./shared




EXPOSE 8001
CMD [ "node", "server/dist/index.js"]



