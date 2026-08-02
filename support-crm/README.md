
# Support Desk — Customer Support Ticketing CRM

A small full-stack ticketing system: create tickets, search/filter them, and
work them through Open → In Progress → Closed with internal notes attached.

Stack: **MongoDB + Express + React + Node (MERN)**, styled with Tailwind CSS.

## Live

- **App**: https://support-crm-two.vercel.app
- **API**: https://support-crm-nbll.onrender.com

The backend is on Render's free tier, which spins down after periods of
inactivity — the first request after a while may take 30–50 seconds to
wake it up. Subsequent requests are fast.

## Architecture
support-crm/
├── backend/ Express API + Mongoose models
│ ├── models/
│ │ ├── Ticket.js ticket schema (notes embedded as subdocuments)
│ │ └── Counter.js atomic counter that generates TKT-001, TKT-002, ...
│ ├── routes/
│ │ └── tickets.js the 4 REST endpoints
│ └── server.js app entry point
└── frontend/ React (Vite) + Tailwind
└── src/
├── api.js fetch wrapper for the backend
├── pages/ Home, NewTicket, TicketDetail
└── components/ TicketRow, StatusTag, SearchFilterBar


**Design decision — notes as embedded subdocuments, not a separate
collection.** The spec's "notes table" makes sense for a relational DB with
a foreign key. In MongoDB, data that's always read and written together
with its parent (a ticket's notes are only ever shown on that ticket's page)
is idiomatically embedded as an array field on the ticket document instead.
This avoids an extra round-trip on every ticket detail view.

**Design decision — ticket IDs.** `TKT-001`, `TKT-002`, ... are generated
from a one-document `counters` collection using an atomic
`findOneAndUpdate($inc)`. MongoDB has no built-in auto-increment (unlike SQL
`SERIAL`), so this is the standard pattern for it — it stays correct even
if two tickets are created at the same instant.

## API

| Method | Route                  | Purpose                                |
|--------|-------------------------|-----------------------------------------|
| POST   | `/api/tickets`           | Create a ticket                        |
| GET    | `/api/tickets`           | List tickets (`?status=`, `?search=`)  |
| GET    | `/api/tickets/:ticket_id`| Full detail for one ticket             |
| PUT    | `/api/tickets/:ticket_id`| Update status and/or add a note        |

## Running locally

You'll need Node 18+ and a MongoDB connection string (a free
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster works
fine — takes about 5 minutes to set up).

**Backend**
```bash
cd backend
cp .env.example .env      # fill in MONGO_URI
npm install
npm run dev                # http://localhost:5000
```

**Frontend** (in a second terminal)
```bash
cd frontend
cp .env.example .env       # defaults to http://localhost:5000, fine for local dev
npm install
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173 — create a ticket, search for it, filter by
status, open it and update its status or add a note.

## Deployment

This app is deployed as: **Render** (backend) + **Vercel** (frontend) +
**MongoDB Atlas** (database).

**Backend → Render.com** (free tier)
1. New Web Service → connect this repo → root directory `backend`.
2. Build command: `npm install`. Start command: `npm start`.
3. Environment variables:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `CLIENT_ORIGIN` — the deployed frontend URL (`https://support-crm-two.vercel.app`),
     used for CORS

**Frontend → Vercel**
1. New Project → connect this repo → root directory `frontend`.
2. Framework preset: Vite (auto-detected).
3. Environment variable:
   - `VITE_API_URL` — the deployed backend URL (`https://support-crm-nbll.onrender.com`)

Vercel assigns multiple URLs per project (a stable production domain plus
per-branch/per-deploy preview URLs). `CLIENT_ORIGIN` on the backend must
match the **production** domain exactly, including scheme and no trailing
slash, or the browser will block API calls with a CORS error.

**Database → MongoDB Atlas**
Free M0 cluster, one database user (SCRAM password auth), Network Access
set to allow `0.0.0.0/0` for simplicity in a take-home project.

## What's not here (by design, per the spec)

- No authentication — out of scope for the MVP.
- No pagination on the ticket list — fine at take-home scale; would add
  cursor-based pagination before this went to real production traffic.
- Search is a case-insensitive regex `$or` across fields rather than a
  full-text index, since it needs to match substrings as the user types,
  not just whole words.
