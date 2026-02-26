# Simple Blog with Laravel, React & Docker

A minimal blog with a Laravel REST API, React frontend, and Docker (Laravel + MySQL + Nginx). Includes registration, login, articles, and comments.

---

## Prerequisites

Before running the project, install the following:

| Requirement | Purpose |
|-------------|---------|
| **Node.js** (v18+) and **npm** | Run the start script and the React frontend |
| **Docker** and **Docker Compose** | Run the backend (Laravel), MySQL, and Nginx |

Ensure Docker is running (Docker Desktop or equivalent) before you start.

---

## How to run the project

### Option 1: Single command (recommended)

From the **project root** (the folder that contains `frontend/`, `backend/`, and `docker-compose.yml`):

```bash
npm start
```

This single command will:

1. **Install frontend dependencies** – Runs `npm install` in `frontend/` if `node_modules` is missing (first run only).
2. **Start Docker** – Builds and starts the containers: MySQL 8, Laravel (PHP-FPM), and Nginx.
3. **Wait for the database** – Waits ~15 seconds for MySQL to accept connections.
4. **Run migrations** – Connects to the database and runs `php artisan migrate` to create all tables (users, articles, comments, cache, sessions, jobs).
5. **Start the frontend** – Runs the Vite dev server for the React app (keeps running in the foreground).

When you see the Vite “Local” URL, the app is ready.

- **Frontend (browser):** http://localhost:5173  
- **Backend API:** http://localhost:8000  
- **API example:** http://localhost:8000/api/articles  

To stop: press **Ctrl+C** in the terminal (this stops only the frontend). To stop the backend as well, run:

```bash
docker compose down
```

---

### Option 2: Step-by-step (manual)

If you prefer to run backend and frontend separately or without the start script:

#### Step 1: Start the backend (Docker)

From the project root:

```bash
docker compose up -d --build
```

This starts MySQL, the Laravel app container, and Nginx. The API will be available at http://localhost:8000 after the containers are up.

#### Step 2: Run migrations (create database tables)

Wait a short time for MySQL to be ready (e.g. 10–15 seconds), then run:

```bash
docker compose exec app php artisan migrate --force
```

This creates (or updates) all tables: `users`, `articles`, `comments`, `cache`, `sessions`, `jobs`, etc.

#### Step 3: (Optional) Seed demo data

To insert demo articles and comments:

```bash
docker compose exec app php artisan migrate --seed
```

Or, if migrations are already run:

```bash
docker compose exec app php artisan db:seed
```

#### Step 4: Install frontend dependencies (first time only)

```bash
cd frontend
npm install
```

#### Step 5: Start the frontend

From the project root:

```bash
cd frontend
npm run dev
```

Or from the project root without changing directory:

```bash
npm run dev --prefix frontend
```

The frontend will be at http://localhost:5173 and will proxy `/api` requests to http://localhost:8000.

---

## Project structure

| Path | Description |
|------|-------------|
| `backend/` | Laravel API (PHP), migrations, models, controllers |
| `frontend/` | React + Vite + TypeScript app |
| `nginx/` | Nginx config for the Laravel app |
| `docker-compose.yml` | Defines `db`, `app`, and `nginx` services |
| `scripts/start.js` | Script run by `npm start` (Docker + migrate + frontend) |
| `package.json` (root) | Contains `npm start` script |

---

## Useful commands

All of these are run from the **project root** unless stated otherwise.

| Task | Command |
|------|---------|
| Start everything (single command) | `npm start` |
| Stop frontend | Press **Ctrl+C** in the terminal where `npm start` is running |
| Stop backend (Docker) | `docker compose down` |
| Rebuild and start Docker only | `docker compose up -d --build` |
| Run migrations only | `docker compose exec app php artisan migrate --force` |
| Run migrations and seed | `docker compose exec app php artisan migrate --seed` |
| View Docker logs | `docker compose logs -f` |
| Laravel Tinker (REPL) | `docker compose exec app php artisan tinker` |
| Install frontend deps | `cd frontend && npm install` |
| Start frontend only | `cd frontend && npm run dev` |
| Build frontend for production | `cd frontend && npm run build` |

---

## Environment and configuration

- **Backend (Laravel):** Docker uses `backend/.env.docker` for DB and app settings. The app container connects to the `db` service (MySQL) with database `blog`, user `blog`, password `secret`.
- **Frontend:** Uses Vite’s dev server; API base URL is set via `frontend/vite.config.ts` (proxy to `/api` → http://localhost:8000). Optional: set `VITE_API_BASE_URL` in `frontend/.env` if you need a different API URL.

---

## Troubleshooting

- **“Cannot connect to database” or migration fails:**  
  MySQL may not be ready yet. Wait 15–20 seconds and run migrations again:  
  `docker compose exec app php artisan migrate --force`

- **Port 8000 or 5173 already in use:**  
  Stop the process using that port, or change the port in `docker-compose.yml` (8000) or `frontend/vite.config.ts` (5173).

- **Frontend can’t reach the API:**  
  Ensure Docker is running and the backend is up (`docker compose ps`). The frontend should proxy `/api` to http://localhost:8000.

- **Clean slate (reset DB and containers):**  
  `docker compose down -v` (removes volumes), then run `npm start` again and migrations will recreate the tables.
