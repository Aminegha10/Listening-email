# SMAB Email Dashboard FullStack

A full-stack email dashboard and order management system built with:
- **Dashboard frontend**: Next.js + React + Redux Toolkit
- **Dashboard backend**: Express + MongoDB + REST APIs
- **Email polling services**: `Listening-email MAG` and `Listening-email MED`
- **Docker Compose** for local deployment

## Overview

This repository includes a modern admin dashboard for managing orders, clients, products, and user authentication, alongside email polling microservices for Gmail-based workflows.

The frontend communicates with the backend through a REST API. The backend handles authentication, order/product/client data, and MongoDB persistence.

## Key Features

- User authentication with JWT and refresh tokens
- Dashboard analytics: order stats, top products, top agents, and client reports
- Dynamic data fetching via RTK Query
- Full MVC backend structure with routes, controllers, models, and middleware
- Dockerized local deployment with MongoDB
- Separate email-listening services for advanced Gmail integrations

## Repository Structure

- `dashboard_frontend/` - Next.js dashboard application
- `dashboard_backend/` - Express API server with MongoDB
- `Listening-email MAG/` - Gmail polling service for MAG workflow
- `Listening-email MED/` - Gmail polling service for MED workflow
- `docker-compose.yml` - Local Docker Compose setup
- `docker-compose.prod.yml` - Production Docker Compose setup

## Tech Stack

- Frontend: Next.js, React, Redux Toolkit, RTK Query, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, CORS
- Docker: `docker compose` for multi-container orchestration
- Optional: Google APIs, Puppeteer, PDF printing, email polling

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd SMAB_EmailDashboard_FullStack
```

### 2. Run with Docker Compose (recommended)

```bash
docker compose up --build
```

- Frontend: `http://localhost:8000`
- Backend: `http://localhost:5000`
- MongoDB exposed on host port `2000`

### 3. Manual startup

#### Backend

```bash
cd dashboard_backend
npm install
npm run dev
```

#### Frontend

```bash
cd dashboard_frontend
npm install
npm run dev
```

## Environment Variables

The backend loads environment variables from `.env.development` or `.env.production` depending on `NODE_ENV`.

### `dashboard_backend/.env.development`

```env
PORT=5000
MONGO_URI=mongodb://aminegha10:ghytfr45@mongo:27017/<your-db>?authSource=admin
FRONT_URL=http://localhost:8000
JWT_SECRET=your_jwt_secret
```

### `dashboard_frontend/.env.development`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> Make sure your frontend and backend URLs match the `FRONT_URL` and `NEXT_PUBLIC_API_URL` values.

## Docker Production

The `docker-compose.prod.yml` file is configured to use prebuilt images:
- `aminegha10/smab_emaildashboard_fullstack-frontend`
- `aminegha10/smab_emaildashboard_fullstack-backend`

Use this file for production-ready deployment.

## Useful Commands

### Frontend
- `npm run dev` - start Next.js development server
- `npm run build` - build production app
- `npm run start` - serve production build
- `npm run lint` - run ESLint

### Backend
- `npm run dev` - start backend with `nodemon`
- `npm start` - start backend in production mode

## Notes

- The backend uses `FRONT_URL` for CORS configuration.
- Frontend API requests use `NEXT_PUBLIC_API_URL`.
- MongoDB is configured in Docker Compose and can be accessed on host port `2000`.
- `Listening-email MAG` and `Listening-email MED` are separate services for email polling and printing and are not included in the main `docker-compose.yml` by default.

## Contact

If you need help running the project or want to add features, update the README with your custom environment values and service details.

