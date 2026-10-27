# Shelf – Book Library (React + Express + MongoDB)

A full-stack reading library. Add books, track status (To Read / Reading / Finished), rate them, search, filter, sort, and view reading stats.

**Data flow:** React → `fetch` → Express REST API → Mongoose → MongoDB

```text
project-root/
├── README.md
├── .gitignore
├── frontend/   (React + Vite)
└── backend/    (Express + Mongoose)
```

## 1. Prerequisites
- Node.js 18+ and npm
- MongoDB: either MongoDB Community Server running locally, or a free MongoDB Atlas cluster
- MongoDB Compass (to inspect the data)
- Git and VS Code (optional)

## 2. Install
```bash
cd backend && npm install
cd ../frontend && npm install
```

## 3. Database and Compass
**Local MongoDB:** start the MongoDB service. The database `shelf` and its `books` collection are created automatically on the first insert.

**Atlas:** create a cluster, add a database user, allow your IP under Network Access, and copy the connection string.

**Compass:** open Compass, click *Add new connection*, paste the same URI you put in `backend/.env` (for local: `mongodb://127.0.0.1:27017/shelf`), and connect. After adding a book in the app, open database `shelf` → collection `books` to see the document.

## 4. Configure `backend/.env`
```bash
cd backend
cp .env.example .env      # Windows: copy .env.example .env
```
Edit `MONGODB_URI` (and `PORT` / `CLIENT_ORIGIN` if needed). Never commit `.env`.

## 5. Run (two terminals)
```bash
# Terminal 1
cd backend && npm run dev     # or: npm start
# Terminal 2
cd frontend && npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000 (health check: http://localhost:5000/api/health)

The Vite dev server proxies `/api` to port 5000. For a deployed frontend, set `VITE_API_URL` to the backend origin and set `CLIENT_ORIGIN` on the backend.

## 6. API endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Server check |
| GET | `/api/books?q=&status=&genre=&sort=` | List, search, filter, sort (`newest`, `oldest`, `title`, `author`, `rating`) |
| GET | `/api/books/stats` | Totals, averages, counts by status and genre |
| GET | `/api/books/:id` | One book |
| POST | `/api/books` | Create |
| PUT | `/api/books/:id` | Update |
| DELETE | `/api/books/:id` | Delete |

Book fields: `title` (required, ≤150), `author` (required, ≤100), `genre`, `status`, `rating` (0–5 integer), `pages` (integer ≥1, optional), `notes` (≤1000).
Responses look like `{ "success": true, "data": ..., "message": "..." }`; errors return `{ "success": false, "message": "..." }` with status 400 (invalid input/ID), 404 (not found) or 500.

## 7. Testing
**Automated API smoke test** (backend must be running):
```bash
cd backend && npm run test:api
```
It checks invalid input → 400, create → 201, list/search, get by ID, update, invalid ID → 400, delete, and deleted record → 404.

**Manual end-to-end check**
1. Add a book in the UI → it appears in the list and as a document in Compass (`shelf.books`).
2. Refresh the page → the book is still there.
3. Edit it → the change shows in Compass. 
4. Delete it → confirm the dialog; the document disappears from Compass.
5. Submit the form empty → inline errors appear. Stop the backend → the list shows a retry message.
6. Try search, status/genre filters, sorting and the Stats page.

## 8. Troubleshooting
| Problem | Fix |
|---|---|
| `MONGODB_URI is not set` | Create `backend/.env` from `.env.example` |
| `ECONNREFUSED 127.0.0.1:27017` | Start local MongoDB, or use an Atlas URI |
| Atlas auth / timeout errors | Check username, password (URL-encode special characters) and Network Access IP list |
| UI says "Cannot reach the server" | Start the backend; confirm port 5000 is free |
| CORS error | Set `CLIENT_ORIGIN` in `backend/.env` to the frontend's exact origin and restart |
| Port already in use | Change `PORT` in `.env` and the proxy target in `frontend/vite.config.js` |
