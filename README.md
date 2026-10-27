# Shelf – Book Library (React + Express + MongoDB)

A full-stack reading library. Add books, track status (To Read / Reading / Finished), rate them, search, filter, sort, and view reading stats.

**Data flow:** React → `fetch` → JWT-authenticated Express REST API → Mongoose → MongoDB

```text
project-root/
├── README.md
├── .gitignore
├── client/     (React + Vite)
└── server/     (Express + Mongoose)
```

## 1. Prerequisites
- Node.js 18+ and npm
- MongoDB: either MongoDB Community Server running locally, or a free MongoDB Atlas cluster
- MongoDB Compass (to inspect the data)
- Git and VS Code (optional)

## 2. Install
```bash
cd server && npm install
cd ../client && npm install
```

## 3. Database and Compass
**Local MongoDB:** start the MongoDB service. The database `shelf` and its `books` collection are created automatically on the first insert.

**Atlas:** create a cluster, add a database user, allow your IP under Network Access, and copy the connection string.

**Compass:** open Compass, click *Add new connection*, paste the same URI you put in `server/.env` (for local: `mongodb://127.0.0.1:27017/shelf`), and connect. After adding a book in the app, open database `shelf` → collection `books` to see the document.

## 4. Configure `server/.env`
```bash
cd server
cp .env.example .env      # Windows: copy .env.example .env
```
Edit `MONGODB_URI`, `JWT_SECRET` (a long random value), and optionally `PORT` / `CLIENT_ORIGIN`. Never commit `.env`.

## 5. Run (two terminals)
```bash
# Terminal 1
cd server && npm run dev      # or: npm start
# Terminal 2
cd client && npm run dev
```
- Client: http://localhost:5173
- Server: http://localhost:5000 (health check: http://localhost:5000/api/health)

The Vite dev server proxies `/api` to port 5000. For a deployed client, set `VITE_API_URL` to the server origin and set `CLIENT_ORIGIN` on the server.

## 6. API endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Server check |
| POST | `/api/auth/register` | Create an account and return a JWT |
| POST | `/api/auth/login` | Log in and return a JWT |
| GET | `/api/books?q=&status=&genre=&sort=` | List the signed-in user's books |
| GET | `/api/books/stats` | Stats for the signed-in user's books |
| GET | `/api/books/:id` | One of the signed-in user's books |
| POST | `/api/books` | Create a book for the signed-in user |
| PUT | `/api/books/:id` | Update the signed-in user's book |
| DELETE | `/api/books/:id` | Delete the signed-in user's book |

Book endpoints require `Authorization: Bearer <token>`. Each book is associated with its creating user, so users cannot access one another's libraries.

Book fields: `title` (required, ≤150), `author` (required, ≤100), `genre`, `status`, `rating` (0–5 integer), `pages` (integer ≥1, optional), `notes` (≤1000).
Responses look like `{ "success": true, "data": ..., "message": "..." }`; errors return `{ "success": false, "message": "..." }` with status 400 (invalid input/ID), 404 (not found) or 500.

## 7. Testing
**Automated API smoke test** (server must be running):
```bash
cd server && npm run test:api
```
It checks invalid input → 400, create → 201, list/search, get by ID, update, invalid ID → 400, delete, and deleted record → 404.

**Manual end-to-end check**
1. Register or log in, then add a book → it appears in the list and as a document in Compass (`shelf.books`).
2. Refresh the page → the book is still there.
3. Edit it → the change shows in Compass. 
4. Delete it → confirm the dialog; the document disappears from Compass.
5. Submit the form empty → inline errors appear. Stop the server → the list shows a retry message.
6. Try search, status/genre filters, sorting and the Stats page.

## 8. Troubleshooting
| Problem | Fix |
|---|---|
| `MONGODB_URI is not set` | Create `server/.env` from `.env.example` |
| `ECONNREFUSED 127.0.0.1:27017` | Start local MongoDB, or use an Atlas URI |
| Atlas auth / timeout errors | Check username, password (URL-encode special characters) and Network Access IP list |
| UI says "Cannot reach the server" | Start the server; confirm port 5000 is free |
| CORS error | Set `CLIENT_ORIGIN` in `server/.env` to the client's exact origin and restart |
| Port already in use | Change `PORT` in `.env` and the proxy target in `client/vite.config.js` |
