# Zelora Recruitment Kanban — Full Stack

A recruitment pipeline management app with a Kanban-style board, built as a full-stack solution: a React (Vite) frontend and a Node.js/Express REST API backend.

---

## Project Structure
Zelora_Project/
├── frontend/ # React + Vite UI
├── backend/ # Node.js + Express REST API
└── README.md # This file

---

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a separate terminal)
cd frontend
npm install
```

### 2. Run both servers

You need **two terminals** running at the same time.

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Runs on **http://localhost:5000**

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Runs on **http://localhost:5173**

### 3. Open the app

Go to **http://localhost:5173** in your browser. The frontend fetches candidate data live from the backend API.

> **Note:** The backend must be running for the frontend to load data. If you see an error screen, make sure `npm run dev` is running inside `backend/`.

---

## API Endpoints

Base URL: `http://localhost:5000/api/candidates`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/candidates` | List all candidates |
| GET | `/api/candidates?stage=screening` | Filter candidates by stage |
| GET | `/api/candidates?sortBy=score` | Sort by score (or `date`) |
| GET | `/api/candidates?page=1&limit=5` | Paginate results |
| GET | `/api/candidates/:id` | Get a single candidate |
| POST | `/api/candidates` | Create a new candidate |
| PUT | `/api/candidates/:id` | Update a candidate (full or partial) |
| PATCH | `/api/candidates/:id/stage` | Update only the candidate's stage (used for drag-and-drop) |
| DELETE | `/api/candidates/:id` | Delete a candidate |

Valid `stage` values: `applying`, `screening`, `interview`, `test`

### Example: Create a candidate
```bash
POST /api/candidates
Content-Type: application/json

{
  "name": "Jane Smith",
  "stage": "applying",
  "score": 4,
  "referred": true,
  "assessmentStatus": "Not Started"
}
```

### Example: Move a candidate's stage
```bash
PATCH /api/candidates/1/stage
Content-Type: application/json

{
  "stage": "interview"
}
```

---

## Candidate Data Model

| Field | Type | Description |
|---|---|---|
| `id` | number | Auto-generated |
| `name` | string | Candidate's full name |
| `date` | string | Application date |
| `score` | number \| null | Overall score |
| `referred` | boolean | Referral status |
| `stage` | string | One of the 4 pipeline stages |
| `pi` | number | Avatar palette index (used for UI color) |
| `assessmentStatus` | string | `Not Started`, `Pending`, or `Completed` |

---

## Assumptions & Design Decisions

- **In-memory data store**: The backend stores candidates in a JavaScript array (`backend/data/candidates.js`), not a database. Data resets to the initial 14 candidates whenever the server restarts (e.g. on every `nodemon` reload during development).
- **Full-stack integration**: The frontend fetches candidates from the API on load and calls the `PATCH /:id/stage` endpoint when a card is dragged to a new column, so stage changes persist on the backend (until the server restarts).
- **CORS**: Enabled on the backend (`cors` middleware) to allow requests from the frontend's dev server on a different port.
- **Validation**: `name` and `stage` are required on candidate creation; `stage` must be one of the 4 valid pipeline stages on create, update, or patch.
- **No authentication**: Out of scope for this task — all endpoints are open.

---

## Tech Stack

- **Frontend**: React 19, Vite, inline CSS (no Tailwind, per task requirements)
- **Backend**: Node.js, Express 5, CORS middleware, in-memory data store
- **Tooling**: nodemon (backend hot-reload), Postman (API testing)

---

## Notes

This is an unpaid internship selection task, solely intended to assess technical capabilities. It will not be used in production or for any commercial purpose.