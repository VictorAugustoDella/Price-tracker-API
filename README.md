<h1 align="center">📉 Price Tracker</h1>

<p align="center">
  Full-stack price monitoring platform for <strong>Amazon Brazil</strong> and <strong>Mercado Livre</strong>, featuring secure authentication, automatic background tracking, price history, and a responsive React dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Flask-3.1.3-000000?style=flat-square&logo=flask&logoColor=white" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=0B1F33" />
  <img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Broker-DC382D?style=flat-square&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Celery-Background%20Jobs-37814A?style=flat-square" />
  <img src="https://img.shields.io/badge/Playwright-Web%20Scraping-2EAD33?style=flat-square&logo=playwright&logoColor=white" />
  <img src="https://img.shields.io/badge/Pytest-Tests-0A9EDC?style=flat-square&logo=pytest&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-CI-2088FF?style=flat-square&logo=githubactions&logoColor=white" />
</p>

<p align="center">
  <strong>Project status:</strong> ✅ MVP v1 feature complete
</p>

---

## 📌 About the project

**Price Tracker** is a full-stack application built to monitor product prices over time.

The user registers a product using a valid URL from **Amazon Brazil** or **Mercado Livre**, and the application automatically:

- detects which marketplace scraper should be used;
- collects the real product name;
- extracts the current price from the product page;
- creates the initial price history record;
- periodically checks the product again in the background;
- stores a new price history entry only when the price changes;
- presents the data in a responsive dashboard with historical insights and statistics.

This project was designed as a portfolio case study focused on building a more realistic full-stack application, going beyond basic CRUD by including:

- secure authentication;
- background jobs;
- job scheduling;
- web scraping;
- data modeling;
- price analytics;
- Docker orchestration;
- automated tests;
- CI workflows.

---

## 🎥 Demo & interface previews

> Replace the placeholders below with the final images, GIFs, and/or short demo videos before publishing the project as a portfolio showcase.

### 🎬 Product demo GIF

![Demo GIF placeholder](docs/media/demo-placeholder.gif)

### 🔐 Login screen

![Login screen placeholder](docs/screenshots/login-placeholder.png)

### 🧾 Register screen

![Register screen placeholder](docs/screenshots/register-placeholder.png)

### 📊 Dashboard

![Dashboard placeholder](docs/screenshots/dashboard-placeholder.png)

### 🛒 Product details

![Product details placeholder](docs/screenshots/product-details-placeholder.png)

### 📈 Price history & statistics

![Statistics placeholder](docs/screenshots/stats-placeholder.png)

---

## ✨ Main features

### 🔐 Secure authentication

- user registration;
- login and logout flow;
- JWT authentication stored in **HTTP-only cookies**;
- access token and refresh token separation;
- refresh flow based on secure cookies;
- CSRF protection for state-changing requests;
- authenticated session verification endpoint;
- protected frontend routes;
- throttled user activity tracking via `last_access`.

---

### 🛒 Product management

- register a product using a marketplace URL;
- automatic marketplace resolution;
- support for:
  - `amazon.com.br`
  - `mercadolivre.com.br`
- scraping of:
  - product name;
  - current product price;
- product listing per authenticated user;
- product details page;
- rename tracked products;
- delete tracked products;
- duplicate URL prevention per user.

---

### 🏷️ Price history

- first historical price automatically saved during product creation;
- manual price refresh endpoint;
- automatic background price tracking;
- price history ordered by collection date;
- new automatic history entry saved **only if the detected price changed**.

---

### 📊 Price statistics

The application calculates:

- current price;
- average price;
- lowest price;
- highest price;
- total number of records;
- variation percentage;
- best-price indicator;
- last 30 days average;
- price trend:
  - `up`
  - `down`
  - `stable`

It also supports selective field filtering using the `fields` query parameter.

Example:

```http
GET /api/v1/products/1/prices/stats?fields=current,lowest,price_trend
```

---

### ⚙️ Automatic background monitoring

The project uses **Celery**, **Redis**, and **Celery Beat** to track products automatically.

Each product stores:

- `last_checked_at`
- `next_check_at`

When a new product is registered:

```txt
next_check_at = creation time + 1 hour
```

A periodic scheduler runs every 5 minutes:

```txt
Celery Beat
↓
enqueue_due_product_checks_task
↓
Find products with next_check_at <= now
↓
Enqueue one tracking task per due product
↓
Celery Worker scrapes the price and updates tracking timestamps
```

This avoids updating every product at the exact same time and distributes the tracking workload more naturally.

---

## 🧠 Architecture overview

### Backend

The backend follows a layered structure:

```txt
routes → services → validators/models
```

- **routes/**  
  HTTP endpoints and request/response orchestration.

- **services/**  
  Business logic, scraping workflows, statistics, tracking flows.

- **validators/**  
  Input validation and domain-specific checks.

- **models/**  
  SQLAlchemy database models.

- **utils/**  
  Reusable helpers and cross-cutting utilities.

- **tasks.py**  
  Celery tasks for background processing.

---

### Frontend

The frontend is organized around:

- **pages/**  
  Application screens.

- **components/**  
  Reusable visual sections.

- **hooks/**  
  Page state and orchestration logic.

- **services/**  
  HTTP communication with the backend.

- **utils/**  
  Formatting helpers and reusable utilities.

---

### Background processing

```txt
Flask API
↓
Redis broker
↓
Celery Worker
↓
Database updates / scraping tasks
```

Scheduling is handled by:

```txt
Celery Beat
↓
Periodic dispatch of due tracking checks
```

---

## 🧰 Tech stack

### Backend

- [Python 3.13](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)
- [Flask-Migrate](https://flask-migrate.readthedocs.io/)
- [Alembic](https://alembic.sqlalchemy.org/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)
- [Playwright](https://playwright.dev/python/)
- [Celery](https://docs.celeryq.dev/)
- [Redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Gunicorn](https://gunicorn.org/)

### Frontend

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript)
- [React Router DOM](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- Fetch API

### Testing & DevOps

- [Pytest](https://docs.pytest.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [GitHub Actions](https://github.com/features/actions)

---

## 🛒 Supported marketplaces

Currently, Price Tracker supports product URLs from:

- **Amazon Brazil**  
  `amazon.com.br`

- **Mercado Livre**  
  `mercadolivre.com.br`

If a URL does not belong to a supported marketplace, the backend returns a validation error.

---

## 📡 API endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Create a new user |
| `POST` | `/api/v1/auth/login` | Authenticate user and set secure cookies |
| `POST` | `/api/v1/auth/refresh` | Refresh the access cookie |
| `POST` | `/api/v1/auth/logout` | Clear authentication cookies |
| `GET` | `/api/v1/auth/session` | Check whether the current session is authenticated |

---

### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/products` | List all products from the authenticated user |
| `GET` | `/api/v1/products/<id>` | Get a single tracked product |
| `POST` | `/api/v1/products` | Create a product and scrape its initial price |
| `PUT` | `/api/v1/products/<id>` | Rename a tracked product |
| `DELETE` | `/api/v1/products/<id>` | Delete a tracked product |

---

### Prices

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/products/<id>/prices` | List the historical prices of a product |
| `GET` | `/api/v1/products/<id>/prices/stats` | Return statistics for the product price history |
| `POST` | `/api/v1/products/<id>/prices/refresh` | Manually scrape and store a new price record |

---

## 🔐 Authentication model

The final authentication flow is browser-oriented and uses secure cookies instead of exposing tokens in `localStorage`.

### Final flow

```txt
Login request
↓
Backend validates credentials
↓
Access token + refresh token are stored in HTTP-only cookies
↓
Frontend sends requests using credentials: "include"
↓
CSRF tokens protect state-changing requests
↓
Session endpoint lets the UI know whether the user is authenticated
```

### Why this approach?

This architecture reduces token exposure in the frontend and gives the project a more production-inspired authentication flow.

---

## 🐳 Running the full project with Docker

This is the recommended way to run the application.

### 1. Clone the repository

```bash
git clone https://github.com/VictorAugustoDella/Price-tracker-API.git
cd Price-tracker-API
```

### 2. Create the root `.env` file

```bash
cp .env.example .env
```

### 3. Start the complete stack

```bash
docker compose up --build
```

This command starts:

- React frontend;
- Flask API;
- PostgreSQL database;
- Redis broker;
- Celery Worker;
- Celery Beat scheduler.

### 4. Access the application

Frontend:

```txt
http://localhost:5173
```

Backend API:

```txt
http://localhost:5000
```

> The backend container automatically runs database migrations before starting the API server.

---

## 🔑 Environment variables

Create a `.env` file in the project root using `.env.example` as a starting point.

```env
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-too
DATABASE_URL=postgresql+psycopg2://project:project@db:5432/project

POSTGRES_USER=project
POSTGRES_PASSWORD=change-me
POSTGRES_DB=project

CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

---

## 💻 Running locally without Docker

Docker Compose is the preferred setup because it launches the entire stack consistently.

If you want to run components manually, use the steps below.

---

### Backend setup

```bash
cd backend
python -m venv .venv
```

#### Linux / macOS

```bash
source .venv/bin/activate
```

#### Windows PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```bash
pip install -r requirements.txt
pip install -r dev-requirements.txt
```

Install Playwright Chromium:

```bash
python -m playwright install chromium
```

Create a local `.env` file and configure a database connection.

Example using SQLite:

```env
SECRET_KEY=local-secret-key
JWT_SECRET_KEY=local-jwt-secret-key
DATABASE_URL=sqlite:///local.db
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

Run migrations:

```bash
flask --app run.py db upgrade
```

Start the backend:

```bash
python run.py
```

---

### Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```txt
http://localhost:5173
```

---

### Redis, Celery Worker, and Celery Beat

To reproduce the automatic tracking system without Docker, you also need:

- a running Redis server;
- a Celery Worker;
- a Celery Beat scheduler.

Example commands from the `backend/` directory:

```bash
celery -A make_celery worker --loglevel=INFO
```

```bash
celery -A make_celery beat --loglevel=INFO
```

For this reason, Docker Compose remains the recommended setup.

---

## 🧪 Tests

Run backend tests from the `backend/` directory:

```bash
pytest
```

For more detailed output:

```bash
pytest -v
```

The test suite covers:

- authentication flows;
- secure session endpoint behavior;
- product CRUD;
- ownership authorization;
- price history endpoints;
- price statistics;
- automatic tracking services;
- scheduled price-check support logic.

The project also includes a **GitHub Actions CI pipeline** that validates the test suite automatically.

---

## 🗂️ Project structure

```txt
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── price_history_model.py
│   │   │   ├── product_model.py
│   │   │   └── user_model.py
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   ├── price/
│   │   │   └── product/
│   │   ├── services/
│   │   │   ├── scrapers/
│   │   │   ├── price_service.py
│   │   │   ├── price_stats.py
│   │   │   ├── product_service.py
│   │   │   └── user_service.py
│   │   ├── utils/
│   │   │   └── activity.py
│   │   ├── validators/
│   │   │   ├── auth_validators.py
│   │   │   ├── price_validators.py
│   │   │   └── product_validators.py
│   │   ├── celery_app.py
│   │   ├── tasks.py
│   │   ├── __init__.py
│   │   ├── db.py
│   │   └── exceptions.py
│   ├── migrations/
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   ├── test_price.py
│   │   ├── test_price_tracking.py
│   │   └── test_product.py
│   ├── Dockerfile
│   ├── make_celery.py
│   ├── requirements.txt
│   ├── dev-requirements.txt
│   ├── pytest.ini
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
├── .env.example
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

## 🧱 Layer responsibilities

| Layer | Responsibility |
|---|---|
| `routes/` | Handles HTTP endpoints |
| `services/` | Encapsulates business rules |
| `validators/` | Validates payloads and domain constraints |
| `models/` | Represents persisted entities |
| `scrapers/` | Extracts product data from marketplaces |
| `tasks.py` | Defines Celery background jobs |
| `tests/` | Covers critical application behavior |

---

## ⚙️ Technical decisions worth highlighting

Some implementation decisions that make the project closer to a production-style application:

- secure JWT authentication using **HTTP-only cookies**;
- CSRF protection for cookie-based authenticated actions;
- frontend session awareness through `/auth/session`;
- background processing with **Celery + Redis**;
- periodic scheduling with **Celery Beat**;
- per-product scheduling through `next_check_at`;
- automatic price history entries only when the price changes;
- safer worker behavior if a product disappears before task execution;
- throttled `last_access` updates to avoid unnecessary database writes;
- marketplace-specific scraper isolation;
- resolver-based scraper selection by URL;
- backend separation into routes, services, validators, and models;
- migrations for schema evolution;
- Docker orchestration for the complete local environment;
- CI pipeline for automated test validation.

---

## ❌ Common validation errors

### Unsupported marketplace URL

```json
{
  "error": "link must be a amazon or mercadolivre link"
}
```

### Duplicate product URL for the same user

```json
{
  "error": "you already registered this product link"
}
```

### Product not found

```json
{
  "error": "product not found"
}
```

### Invalid URL

```json
{
  "error": "Invalid url"
}
```

---

## 📈 MVP scope

The MVP v1 includes:

- full-stack user flow;
- secure authentication;
- URL-based product tracking;
- automatic scraping of name and price;
- background tracking system;
- periodic checks;
- price history;
- statistics;
- responsive frontend;
- automated tests;
- Dockerized development environment;
- CI.

---

## 🔮 Possible future extensions

These ideas are intentionally outside the MVP v1 scope:

- target-price alerts;
- email or push notifications;
- richer chart visualizations;
- product list pagination;
- filtering by historical periods;
- deployment to a public cloud environment;
- structured logging and observability;
- support for additional marketplaces.

---

## 🎯 Project goal

This project was developed as a practical full-stack portfolio case study.

Its purpose was not only to expose endpoints, but to explore real application concerns such as:

- security;
- session management;
- web scraping;
- background processing;
- scheduling;
- data persistence;
- historical analysis;
- frontend integration;
- test coverage;
- containerized orchestration;
- CI workflows.

It represents the evolution of a backend-centered study project into a complete, production-inspired full-stack application.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).