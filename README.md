# CafApp

CafApp is a campus/food-court companion app. Customers browse participating
restaurants, check live queue status before heading over, view menus, log
complaints and keep a history of what they've ordered. Restaurant
administrators manage their own storefront: toggle online/offline
availability, update queue status and maintain their menu.

## Tech stack

- **Frontend:** React (Vite), React Router
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Auth:** JWT access + refresh tokens, with a two-factor verification step
  on login
- **Infra:** Docker & Docker Compose

## Project structure

```
caf-app/
  backend/     Express API, Postgres schema, auth, business logic
  frontend/    React client (customer + admin experiences)
  docker-compose.yml
```

## Getting started

1. Copy `.env.example` to `.env` and adjust values as needed.
2. Run everything with Docker Compose:

   ```bash
   docker compose up --build
   ```

3. The API is available at `http://localhost:4000/api` and the client at
   `http://localhost:5173`.

### Running locally without Docker

```bash
# backend
cd backend
npm install
npm run dev

# frontend (separate terminal)
cd frontend
npm install
npm run dev
```

You'll need a local Postgres instance and a `DATABASE_URL` pointing at it;
apply `backend/src/db/schema.sql` to create the schema.

## Design

UI follows the CafApp Figma file - onboarding, customer flows (select
restaurant, dish browsing, search, notifications, profile, complaints,
history) and the administrator dashboard (menu management, complaints,
availability).
