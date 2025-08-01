# ft_transcendence

A full-stack web application featuring a NestJS backend API, React frontend, and PostgreSQL database. The project is containerized with Docker and managed via Makefile for seamless local development and deployment. Built as part of the 42 cursus.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Running in Development](#running-in-development)
  - [Running in Production](#running-in-production)
- [Services Overview](#services-overview)
  - [API (NestJS)](#api-nestjs)
  - [Frontend (React)](#frontend-react)
  - [Database](#database)
- [Useful Commands](#useful-commands)
- [API Documentation (Swagger/OpenAPI)](#api-documentation-swaggeropenapi)
- [Authentication & Usage](#authentication--usage)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
ft_transcendence/
├── api/     # NestJS backend API
├── front/   # React frontend
├── db/      # (Optional) Database schema/migrations
```

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Make](https://www.gnu.org/software/make/)
- (Optional for direct local dev) [Node.js](https://nodejs.org/) and npm

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/B-ki/ft_transcendence.git
   cd ft_transcendence
   ```
2. **Configure Environment Variables:**
   - Copy `.env.example` from `api/` and `front/` to `.env` in each folder, fill in required values (DB credentials, JWT secrets, etc).

### Running in Development

Run all services with hot-reload:
```bash
make dev
```
This will:
- Start API, frontend, and database in development mode using Docker Compose
- Hot-reload code on changes

### Running in Production

For optimized builds:
```bash
make prod
```

---

## Services Overview

### API (NestJS)

- **Location:** `api/`
- **Tech:** [NestJS](https://nestjs.com/) (TypeScript)
- **Port:** `3000` (default)
- **How to run locally:**
  ```bash
  cd api
  npm install
  npm run dev    # Development
  npm run build && npm run prod   # Production
  ```
- **Environment:** See `api/.env.example`
- **Features:** REST endpoints for users, authentication, games, chat, notifications; JWT/2FA; Swagger docs

#### Main API Endpoints

All endpoints are prefixed by `/api`.

##### Authentication (`/api/auth`):

- `GET /auth/42/login`  
  Start OAuth with 42, returns JWT and login (or 2FA challenge)

- `POST /auth/2fa/login`  
  Complete login with 2FA code `{ twoFACode }` _(JWT required)_

- `GET /auth/2fa/qrcode`  
  Get a 2FA QR code _(JWT required)_

- `POST /auth/2fa/activate`  
  Activate 2FA with code `{ twoFACode }` _(JWT required)_

- `POST /auth/2fa/deactivate`  
  Disable 2FA with code `{ twoFACode }` _(JWT required)_

##### Users (`/api/user`):

- `GET /user`  
  Get self profile _(JWT+2FA)_

- `GET /user/friends`  
  List friends _(JWT+2FA)_

- `GET /user/profile/:login`  
  Get user profile by login _(JWT+2FA)_

- `GET /user/all`  
  List all users _(JWT+2FA)_

##### Other modules

- Additional RESTful endpoints for games (`/api/game`), chat (`/api/chat`), notifications (`/api/notify`). See Swagger for full details.

##### Authentication

- Most endpoints require a valid JWT (and in most cases, completed 2FA).
- Obtain JWT by authenticating via 42 OAuth and completing 2FA if enabled.

### Frontend (React)

- **Location:** `front/`
- **Tech:** [React](https://react.dev/) (TypeScript, Vite)
- **Port:** `8080` (default)
- **How to run locally:**
  ```bash
  cd front
  npm install
  npm run dev
  ```
- **Environment:** See `front/.env.example`
- **Features:** Responsive UI, connects to backend API, real-time interactions

### Database

- **Type:** PostgreSQL (default)
- **Setup:** Handled by Docker Compose and API migrations (`prisma`)
- **Connection:** Configured via environment variables

---

## Useful Commands

- `make dev` — Start all services in development mode
- `make prod` — Start all services in production mode
- `make dev.logs` / `make prod.logs` — View logs
- `make dev.stop` / `make prod.stop` — Stop all containers
- (See `Makefile` for more)

---

## API Documentation (Swagger/OpenAPI)

- **URL:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Browse and test all endpoints, view parameters and models

---

## Authentication & Usage

- Register/login via frontend (OAuth 42, 2FA supported)
- Use JWT (stored by frontend) for authenticated API calls
- Most API endpoints require JWT and completed 2FA

---

## Contributing

1. Fork the repo and create a feature branch
2. Follow coding standards and commit conventions
3. Test changes locally (`make dev`)
4. Open a pull request

---

## License

MIT License

---

**For more technical details, see the README in each of the `api/` or `front/` folders, or the Swagger docs.**

---

### Notes

- The project uses `pnpm` by default, but you can use `npm` for all scripts (`npm install`, `npm run dev`, etc.).
- If switching to npm, remove `pnpm-lock.yaml` and regenerate `package-lock.json` for consistency.
