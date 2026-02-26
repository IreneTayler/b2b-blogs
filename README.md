## Simple Blog with Laravel, React & Docker

This project implements a minimal blog with a Laravel REST API, a React frontend, and Docker (Laravel + MySQL + Nginx).

### 1. Features

- **Backend (Laravel)**
  - `GET /api/articles` – list articles.
  - `GET /api/articles/{id}` – view single article with comments.
  - `POST /api/articles` – create article (no auth).
  - `POST /api/articles/{id}/comments` – add comment for an article.
  - Models: `Article`, `Comment`.
  - Migrations + seeder creating 3 demo articles with example comments.

- **Frontend (React + Vite + TypeScript)**
  - **Article list page** – title, date, and summary.
  - **Article detail page** – full content, comments, and form to add a new comment.
  - **New article page** – simple form for creating an article.

- **Docker**
  - MySQL 8 database.
  - PHP-FPM container for Laravel.
  - Nginx container serving the Laravel app.

### 2. Running with Docker (Backend + DB + Nginx)

From the project root (`blogs`):

```bash
docker compose up -d --build
```

Run migrations and seed data inside the `app` container:

```bash
docker compose exec app php artisan migrate --seed
```

Backend will be available at:

- `http://localhost:8000` – Laravel
- `http://localhost:8000/api/articles` – example API endpoint

### 3. Running the React Frontend (Locally)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses Vite’s dev server on `http://localhost:5173` and proxies `/api` calls to `http://localhost:8000`, so it will talk to the Laravel API started via Docker.

### 4. Useful Commands

- Rebuild containers after changes:

```bash
docker compose up -d --build
```

- View logs:

```bash
docker compose logs -f
```

- Run artisan commands:

```bash
docker compose exec app php artisan migrate
docker compose exec app php artisan tinker
```

