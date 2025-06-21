# CafApp

CafApp is a campus/food-court companion app. Customers browse participating
restaurants, check live queue status before heading over, view menus, log
complaints and keep a history of what they've ordered. Restaurant
administrators manage their own storefront: toggle online/offline
availability, update queue status and maintain their menu.

## Tech stack

- **Frontend:** React (Create React App), React Router
- **Backend:** Node.js, Express
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT access + refresh tokens, with a two-factor verification step
  on login
- **Infra:** Docker & Docker Compose

## Project structure

```
caf-app/
  backend/
    prisma/    schema.prisma, migrations, seed.js
    src/       Express API, auth, business logic
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
   `http://localhost:3000`.

### Running locally without Docker

```bash
# backend
cd backend
npm install
npm run backend

# frontend (separate terminal)
cd frontend
npm install
npm start
```

You'll need a local Postgres instance and a `DATABASE_URL` pointing at it in
`backend/.env` (see `.env.example`; `backend/.env` itself is gitignored, so
each environment configures its own connection string). Then, from
`backend/`:

```bash
npx prisma migrate deploy   # apply migrations (use `prisma:migrate` for a new dev migration)
npx prisma db seed          # load demo data
```

`npx prisma studio` opens a browser UI for inspecting/editing data directly.

## Demo accounts

Seeded via `backend/prisma/seed.js` (password for all: `Password123!`):

| Role  | Identifier                         | Restaurant     |
| ----- | ----------------------------------- | -------------- |
| Admin | `admin@doubleportion.cafapp.test`   | Double Portion |
| Admin | `admin@foodmart.cafapp.test`        | FoodMart       |
| Admin | `admin@mannapalace.cafapp.test`     | Manna Palace   |
| Customer | `customer@cafapp.test`           | —              |

Login always requires a second step: a 6-digit verification code is logged
to the backend console (`[2FA] verification code for ...`) since no real
email/SMS provider is wired up in development.

## Design

UI follows the CafApp Figma file - onboarding, customer flows (select
restaurant, dish browsing, search, notifications, profile, complaints,
history) and the administrator dashboard (menu management, complaints,
availability).
