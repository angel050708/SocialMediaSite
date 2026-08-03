# SocialMediaSite

A full-stack social network clone (X/Threads-style) built with a Node.js/Express/PostgreSQL backend and a React/Vite frontend. Users can register, follow each other (with a request/accept flow), post, like, comment, and get real-time notifications over WebSockets.

**Live demo:** not deployed yet — see [Local setup](#local-setup) below to run it on your machine.

## Features

- **Auth** — email/password registration and login via Passport (local strategy) with bcrypt password hashing, PostgreSQL-backed sessions (`connect-pg-simple`), and a one-click guest login for trying the app without an account.
- **Profiles** — editable display name, bio, and avatar. Avatars default to Gravatar and can be overridden with a direct image upload (`multer`).
- **Follows** — follow requests with pending/accepted state, accept/reject incoming requests, unfollow.
- **Posts** — create and delete posts (optional image URL), like/unlike, comment/delete comment.
- **Feed** — paginated feed of posts from people you follow.
- **User directory** — browse all users with your relationship status to each (following, pending, none).
- **Notifications** — real-time via Socket.IO for likes, comments, follow requests, and accepted follows.

## Tech stack

**Backend:** Node.js, Express 5, PostgreSQL, Prisma ORM (`@prisma/adapter-pg`), Passport.js + bcrypt, express-session + connect-pg-simple, Socket.IO, Zod (request validation), Helmet, express-rate-limit, Multer.

**Frontend:** React 19, Vite, Tailwind CSS 4, React Router 7, Socket.IO client, Lucide icons.

## Project structure

```
src/                  Express backend
  config/             env, session, passport setup
  controllers/         route handlers
  middleware/          auth guards, validation, rate limiting, uploads
  routes/               API route definitions
  services/            notification dispatch
  validators/          Zod schemas
  lib/                 Prisma client, socket.io, serializers, helpers
prisma/               schema, migrations, seed script
frontend/
  src/components/     reusable UI (forms, cards, layout)
  src/pages/          route-level views
  src/context/        auth + toast context providers
  src/lib/            API client, socket client
uploads/              user-uploaded avatars (gitignored)
```

## Local setup

Requires Node.js and a running PostgreSQL instance.

### Backend

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL and SESSION_SECRET
npm run migrate         # applies Prisma migrations, creates the schema
npm run seed             # optional: seeds 15 fake users + posts/follows/likes
npm run dev
```

The API runs on `http://localhost:3000` by default (`PORT` in `.env`). Seeded users all share the password `Password123!`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL should point at the backend, e.g. http://localhost:3000
npm run dev
```

The app runs on `http://localhost:5173` and expects the backend to be running and reachable at `VITE_API_URL`.

### Environment variables

**Backend (`.env`)**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NODE_ENV` | `development` / `production` |
| `PORT` | API port (default `3000`) |
| `CLIENT_ORIGIN` | Frontend origin, used for CORS + Socket.IO |
| `SESSION_SECRET` | Secret for signing session cookies |

**Frontend (`.env`)**

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |
