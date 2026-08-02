# Support Desk — Customer Support Ticketing CRM

A lightweight full-stack customer support ticketing system built with the MERN stack. It allows agents to create tickets, search and filter them, manage ticket workflows, and maintain internal notes.

**Stack:** MongoDB · Express.js · React · Node.js · Tailwind CSS

---

## Live Demo

* **Frontend:** https://support-crm-two.vercel.app
* **Backend API:** https://support-crm-nbll.onrender.com

> The backend runs on Render's free tier and may sleep after inactivity. The first request after a period of inactivity can take around 30–50 seconds while the service wakes up. Later requests respond normally.

---

# Features

✅ Create support tickets
✅ Search tickets by keyword
✅ Filter tickets by status
✅ Move tickets through workflow states:

* Open
* In Progress
* Closed

✅ Add internal notes to tickets
✅ Generate AI-assisted customer reply drafts using Groq + Llama 3.3 70B

---

# Architecture

```
support-crm/
│
├── backend/                 Express API + Mongoose
│   ├── models/
│   │   ├── Ticket.js        Ticket schema with embedded notes
│   │   └── Counter.js       Atomic ticket ID generator
│   │
│   ├── routes/
│   │   └── tickets.js       Ticket APIs + AI reply endpoint
│   │
│   └── server.js            Application entry point
│
└── frontend/                React + Vite + Tailwind
    │
    └── src/
        ├── api.js
        ├── pages/
        │   ├── Home
        │   ├── NewTicket
        │   └── TicketDetail
        │
        └── components/
            ├── TicketRow
            ├── StatusTag
            └── SearchFilterBar
```

---

# Design Decisions

## Embedded Notes in MongoDB

The specification describes notes like a relational database table, but MongoDB allows a more natural document model.

Notes are stored as embedded subdocuments inside the ticket:

```js
{
  ticket_id: "TKT-001",
  subject: "Login issue",
  notes: [
    {
      body: "Customer contacted support",
      createdAt: "..."
    }
  ]
}
```

Since notes are only accessed together with their parent ticket, embedding them:

* avoids additional database queries
* keeps ticket details in a single document
* matches MongoDB document modeling practices

---

## Ticket ID Generation

Tickets use human-friendly IDs:

```
TKT-001
TKT-002
TKT-003
```

MongoDB does not provide SQL-style auto-increment IDs, so the application uses a dedicated `counters` collection with an atomic increment:

```js
findOneAndUpdate(
  {},
  { $inc: { sequence: 1 } }
)
```

This keeps ID generation safe even when multiple tickets are created simultaneously.

---

# AI Reply Suggestions

Each ticket includes a **✨ Suggest Reply** button.

When clicked, the backend sends:

* ticket subject
* ticket description
* existing internal notes

to Groq running **Llama 3.3 70B**, which returns a suggested customer response.

The generated response:

* appears in the note editor
* can be reviewed and modified by the agent
* is never automatically saved or sent

A human always approves the final message.

## Configuration

Add this environment variable:

```
GROQ_API_KEY=your_key_here
```

Get a free key from:

https://console.groq.com/keys

Without the key, the application continues working normally and returns a clear error when AI suggestions are requested.

---

# API Endpoints

| Method | Endpoint                                | Description                  |
| ------ | --------------------------------------- | ---------------------------- |
| POST   | `/api/tickets`                          | Create a ticket              |
| GET    | `/api/tickets`                          | List tickets                 |
| GET    | `/api/tickets/:ticket_id`               | Get ticket details           |
| PUT    | `/api/tickets/:ticket_id`               | Update status or add notes   |
| POST   | `/api/tickets/:ticket_id/suggest-reply` | Generate AI reply suggestion |

### Query Parameters

Ticket listing supports:

```
GET /api/tickets?status=Open
GET /api/tickets?search=password
```

---

# Running Locally

## Requirements

* Node.js 18+
* MongoDB database connection

A free MongoDB Atlas cluster works well for development.

---

## Backend

```bash
cd backend

cp .env.example .env
```

Configure:

```
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=optional_key
```

Install dependencies:

```bash
npm install
```

Run:

```bash
npm run dev
```

Backend:

```
http://localhost:5000
```

---

## Frontend

Open another terminal:

```bash
cd frontend

cp .env.example .env
```

Default configuration:

```
VITE_API_URL=http://localhost:5000
```

Install:

```bash
npm install
```

Run:

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# Deployment

Deployment architecture:

```
Frontend  →  Vercel
Backend   →  Render
Database  →  MongoDB Atlas
```

---

## Backend Deployment (Render)

1. Create a new Web Service.
2. Connect the repository.
3. Set root directory:

```
backend
```

4. Configure:

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Environment variables:

```
MONGO_URI=your_atlas_connection_string

CLIENT_ORIGIN=https://support-crm-two.vercel.app

GROQ_API_KEY=optional_key
```

---

## Frontend Deployment (Vercel)

1. Create a new project.
2. Select the repository.
3. Set root directory:

```
frontend
```

4. Framework:

```
Vite
```

Environment variable:

```
VITE_API_URL=https://support-crm-nbll.onrender.com
```

---

## MongoDB Atlas

Recommended setup for this project:

* Free M0 cluster
* SCRAM authentication
* Network access:

```
0.0.0.0/0
```

This is acceptable for a take-home project. Production systems should restrict network access.

---

# Scope Decisions

The project intentionally does not include:

## Authentication

Not included because authentication was outside the MVP requirements.

## Pagination

The ticket list does not use pagination because the expected dataset size is small.

For production scale, cursor-based pagination would be added.

## Search Implementation

Search uses MongoDB case-insensitive regex matching across ticket fields.

A full-text index was not used because the requirement is substring matching while typing rather than exact word search.

---

# License

Built as a take-home project demonstrating MERN development, MongoDB modeling, REST API design, and AI-assisted support workflows.
