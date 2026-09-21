# Task 4 — AI-Powered Project & Task Management Platform

Capstone for the Innovation Hacks Full Stack Development internship. Combines the
API from Task 2 and the Postgres/Prisma database layer from Task 3 with a new
React frontend, JWT authentication, and an AI feature.

## Architecture

```
React (Vite) frontend  --HTTPS/JWT-->  Express API  --Prisma-->  PostgreSQL (Neon)
                                             |
                                             +--> Anthropic API (AI task generation / prioritization)
```

- `backend/` — extends the Task 2/3 Express + Prisma codebase. Add auth
  (`passwordHash` on `User`, JWT middleware) and two new route groups:
  `dashboard` (stats/recent activity) and `ai` (task generation, prioritization).
- `frontend/` — new React SPA: Login/Register, Dashboard, Projects, Project
  detail (tasks + AI generator).

## AI Feature: AI-Assisted Task Generation (+ Prioritization)

`POST /api/v1/ai/generate-tasks` takes a project + a plain-language goal and
returns 3–6 structured task suggestions (title, description, priority) via
Claude. Pass `?save=true` to persist them directly as real `Task` rows
(flagged `aiGenerated: true`).

`POST /api/v1/ai/prioritize` looks at a project's open tasks and returns a
suggested priority ranking with reasoning — a light bonus feature reusing the
same JSON-prompting pattern.

The Anthropic API key lives server-side only (`ANTHROPIC_API_KEY` env var on
the backend) — not exposed to the browser, unlike the bring-your-own-key
pattern used in the single-file HTML tools.

## Local setup

```bash
# Backend
cd backend
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY
npm install
npx prisma migrate dev --name init
npm run dev             # http://localhost:5000

# Frontend
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev              # http://localhost:5173
```

## Deployment Plan

Reuses your Task 3 Neon Postgres instance — no new database needed.

| Piece | Platform | Notes |
|---|---|---|
| Backend | Vercel (same pattern as Task 3) or Render | `api/index.js` + `vercel.json` already set up for Vercel serverless, matching your existing `task3-persistent-data-layer` deploy. Render/Railway also work if you'd rather have a long-running server (simpler for background jobs later). |
| Frontend | Vercel or Netlify | `npm run build` → deploy `frontend/dist`. Set `VITE_API_URL` to the deployed backend URL (e.g. `https://task4-api.vercel.app/api/v1`). |
| Database | Neon Postgres (existing) | Reuse the `DATABASE_URL` from Task 3, or create a fresh Neon project if you want Task 4 data isolated from Task 3. |

Steps:
1. Push `backend/` and `frontend/` as two folders in one GitHub repo (or two repos — either is fine for grading, one repo is simpler for the demo video).
2. Deploy `backend/` to Vercel: import repo, set root directory to `backend`, add env vars (`DATABASE_URL`, `JWT_SECRET`, `ANTHROPIC_API_KEY`), it will pick up `vercel.json` automatically (same as Task 3).
3. Run `npx prisma migrate deploy` against the Neon DB (or `migrate dev` locally pointed at Neon) to create the new `passwordHash` column and any missing tables.
4. Deploy `frontend/` to Vercel or Netlify: import repo, root directory `frontend`, build command `npm run build`, output `dist`, set `VITE_API_URL` env var to the live backend URL.
5. Update backend CORS if needed (currently open `cors()` — fine for a capstone demo, tighten to your frontend origin if you want to be thorough).
6. This stays separate from your GitHub Pages static-site habit — GitHub Pages can't run the Express API, so the API must live on Vercel/Render/Railway; only a *static* build of the frontend could go to Pages, but Vercel/Netlify is simpler here since they handle env vars and don't need a `gh-pages` branch dance.

## Deliverables checklist
- [ ] GitHub repo (mandatory)
- [ ] Demo video walking through: register → login → create project → AI-generate tasks → accept them → change status → dashboard updates (mandatory)
- [ ] Live deployment link (optional but strengthens the submission)
- [ ] LinkedIn post tagging Innovation Hacks (mandatory)
