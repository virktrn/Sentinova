# Sentinova - News website (Back End Engineering-II project)

This repository is a ready-to-run Node.js + Express + EJS project implementing the features required in the **Back End Engineering-II** course, including JWT auth, Redis caching hooks, WebSocket live updates, MongoDB CRUD, EJS templating, and testing hooks. The course syllabus covers WebSocket + Redis + EJS + testing + deployment; see the course plan (Back End Engineering-II) for mapping. fileciteturn2file0

## What's included
- Express server with EJS views
- MongoDB models for User and Article
- JWT-based auth with cookies
- Image upload (local `public/uploads`)
- Redis integration (optional) and caching hook
- WebSocket (Socket.IO) emits `new-article` when admin creates an article
- Seed script with sample news data
- Basic CSS (in `public/css/styles.css`)
- Tests folder (skeleton)
- Non-Docker instructions for macOS (works without Docker)

## How to run on your Mac (no Docker)
1. Install Node.js (v16+) and npm if you don't have them.
2. Ensure MongoDB is running locally (e.g. via Homebrew `brew services start mongodb-community` or `mongod`).
3. Ensure Redis is running locally (you said you have Redis).
4. Copy `.env.example` to `.env` and update values (at minimum set `JWT_SECRET`).
   ```bash
   cp .env.example .env
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Seed the DB with sample articles and an admin user:
   ```bash
   npm run seed
   ```
7. Start in dev mode:
   ```bash
   npm run dev
   ```
8. Open `http://localhost:3000` in your browser. Login at `/auth/login` or register. Seeded admin: `admin@sentinova.com` / `password123`.

## Live news data / external API
- The project includes `scripts/seed.js` with sample news content.
- If you want live news from an external provider (NewsAPI.org or similar), add code to `scripts/fetchNews.js` to call the provider with your API key and insert articles into MongoDB. (I didn't include an API key).
- Example stub (you can ask me and I will paste the fetch script and instructions for NewsAPI).

## WebSocket (real-time)
- Socket.IO is configured in `server.js`. When an admin creates an article, the server emits `new-article` which the client listens for and shows a small notice. This satisfies the WebSocket integration topic in the syllabus. fileciteturn2file13

## Mapping to course outcomes
- EJS templating, Express middleware, auth, Redis, WebSocket, testing and deployment mapping are implemented and described to match course topics. See course plan pages for exact lecture mapping. fileciteturn2file6

## If you want:
- I can add a `fetchNews.js` script to pull live headlines (requires you to supply an API key).
- I can add richer UI (rich-text editor for article content), pagination, and search UI.
- I can add full Jest tests for routes and controllers.

Enjoy building — the zip is attached for download.
