# WebSocket Chat

A full-stack, monorepo chat application using React (Vite), Node.js, WebSockets,
Includes a shared package for types and validation, and is ready for local development.

---

## Features

- **Real-time chat** using WebSockets (`ws`)
- **React 19** frontend (Vite)
- **Node.js** backend with WebSocket server
- **Shared types and validation** via a `chat-shared` package (using Zod)
- **Monorepo** managed with [pnpm workspaces](https://pnpm.io/workspaces)
- **Dockerized** for easy local and cloud deployment
- **Linting and formatting** with ESLint and Prettier

---

## Monorepo Structure

```
websocket-chat/
  client/      # React frontend
  server/      # Node.js WebSocket backend
  shared/      # Shared types and schemas
  ...
```

---

## Getting Started (Locally)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)

### Install dependencies

```sh
pnpm install
```

### Run in development mode

**shared:**

```sh
pnpm run shared
```

**Client:**

```sh
pnpm run client
```

**Server:**

```sh
pnpm run server
```

---

### Run tests

**Client:**

```sh
npm run client:test
```

---

### Run linters

**Client:**

```sh
npm run client:lint
```

**Server:**

```sh
npm run server:link
```

---

### Docker

**Build images:**

```sh
docker-compose build
```

**Run containers:**

```sh
docker-compose up
```

### TODOs:

- **Add SQLite DONE** Replace im memory storage (Set / Map) with SQLite to persist data users, messages, rooms.

- **Add online flag** Only show users who are online. User can login with same username if already registered (no auth atm)

- **Add public rooms** Users should be able to create public rooms.

- **Add private room** Users should be able to create private rooms.
