<div align="center">

  <img src="code8flow-wordmark-lockup.svg" alt="code8flow" width="400">

  <br><br>

  <p>
    <strong>Full-stack project management platform — built to production standards</strong><br>
    Java 21 · Spring Boot 3 · React 19 · TypeScript · PostgreSQL · Redis · Kafka · AWS S3
  </p>

  <p>
    🌐 &nbsp;<a href="https://cod8flow.thecod8r.space"><strong>cod8flow.thecod8r.space</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white" alt="Java 21">
    <img src="https://img.shields.io/badge/Spring%20Boot-3-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot 3">
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white" alt="PostgreSQL 16">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
  </p>

  <p>
    <a href="#overview">Overview</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#architecture">Architecture</a> ·
    <a href="#getting-started">Getting Started</a> ·
    <a href="#api-reference">API Reference</a>
  </p>

</div>

---

## Overview

**cod8flow** is a full-stack project management platform I built end-to-end — not a tutorial project. It covers the complete backend engineering lifecycle: auth, database design, caching, async messaging, file storage, testing, and a production-grade React frontend.

---

## What's Built

**Backend**
- JWT authentication — stateless access + refresh token rotation, BCrypt password hashing
- Workspaces, Boards, Tasks — full CRUD with role-based access (OWNER / ADMIN / MEMBER)
- Redis caching — workspace and board responses cached with a 10-minute TTL
- Apache Kafka — task-assigned events published and consumed asynchronously
- AWS S3 — pre-signed URL upload/download for task attachments
- Flyway migrations — 7 versioned SQL migrations, Hibernate set to `validate` (never auto-migrates)
- Spring Boot Actuator — health and metrics endpoints
- Unit tests — service-layer tests for Auth, Workspace, Board, and Task

**Frontend**
- Login page with animated canvas background and interactive Kanban preview
- Drag-and-drop board demo on the login screen (no backend needed)
- Demo accounts for quick access — pre-filled credentials, one click
- Protected routing — unauthenticated users redirected to `/login`
- Workspaces list, Board view, Task detail modal, Create modal
- Zustand for auth state, persisted to localStorage
- Axios client with auto-attached Bearer token and 401 redirect

**DevOps**
- Docker Compose — Postgres 16, Redis 7, and Kafka (KRaft) in one command
- Dockerfile for the Spring Boot backend
- Helm chart for Kubernetes deployment
- GitHub Actions CI pipeline

---

## Tech Stack

### Backend

| Category      | Technology            |
|---------------|-----------------------|
| Language      | Java 21               |
| Framework     | Spring Boot 3         |
| Security      | Spring Security + JWT |
| ORM           | Spring Data JPA       |
| Database      | PostgreSQL 16         |
| Migrations    | Flyway                |
| Cache         | Redis 7               |
| Message Bus   | Apache Kafka (KRaft)  |
| File Storage  | AWS S3                |
| Monitoring    | Spring Boot Actuator  |

### Frontend

| Category   | Technology          |
|------------|---------------------|
| Framework  | React 19 + TypeScript |
| State      | Zustand             |
| HTTP       | Axios               |
| Styling    | Tailwind CSS 4      |
| Routing    | React Router 7      |
| Build      | Vite 8              |

---

## Architecture

```
React Frontend  ──REST/JSON──►  Spring Boot Backend
                                       │
                          ┌────────────┼────────────┐
                          ▼            ▼             ▼
                     PostgreSQL      Redis         Kafka
                     (Flyway)       (cache)     (events)
                                                     │
                                                 AWS S3
                                               (attachments)
```

**Backend package layout:**

```
com.cod8flow/
├── config/          # Security, Redis, Kafka, S3 config
├── controller/      # REST endpoints
├── service/         # Business logic
├── repository/      # Spring Data JPA
├── domain/
│   ├── entity/      # User, Workspace, Board, Task, Attachment
│   └── enums/       # Role, Priority, TaskStatus, WorkspaceRole
├── dto/             # Request + response models
├── security/        # JwtAuthFilter, JwtService
├── consumer/        # Kafka task-assigned listener
└── exception/       # Global @ControllerAdvice error handling
```

---

## Getting Started

### Prerequisites
- Java 21 JDK
- Docker Desktop
- Maven wrapper included — no separate install needed

### Run locally

```bash
git clone https://github.com/pratik20gb/cod8flow.git
cd cod8flow

# Start PostgreSQL, Redis, and Kafka
docker compose up -d

# Start the backend
./mvnw spring-boot:run        # Mac/Linux
mvnw.cmd spring-boot:run      # Windows
```

Backend is available at `http://localhost:8080`.

### Frontend

```bash
cd cod8flow-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Health check

```bash
curl http://localhost:8080/api/v1/health
```

---

## Demo Access

The live site has two pre-seeded demo accounts:

| Role         | Email                         | Password   |
|--------------|-------------------------------|------------|
| Interviewer  | interviewer@cod8flow.com      | Demo1234!  |
| Developer    | developer@cod8flow.com        | Demo1234!  |

---

## API Reference

### Authentication

| Method | Endpoint                | Description                                   |
|--------|-------------------------|-----------------------------------------------|
| POST   | `/api/v1/auth/register` | Create account                                |
| POST   | `/api/v1/auth/login`    | Login — returns access + refresh tokens       |
| POST   | `/api/v1/auth/refresh`  | Get a new access token via refresh token      |

All protected endpoints require: `Authorization: Bearer <access_token>`

### Workspaces

| Method | Endpoint                  |
|--------|---------------------------|
| GET    | `/api/v1/workspaces`      |
| POST   | `/api/v1/workspaces`      |
| GET    | `/api/v1/workspaces/{id}` |
| PUT    | `/api/v1/workspaces/{id}` |
| DELETE | `/api/v1/workspaces/{id}` |

### Boards

| Method | Endpoint                                  |
|--------|-------------------------------------------|
| GET    | `/api/v1/workspaces/{workspaceId}/boards` |
| POST   | `/api/v1/workspaces/{workspaceId}/boards` |
| GET    | `/api/v1/boards/{boardId}`                |
| DELETE | `/api/v1/boards/{boardId}`                |

### Tasks

| Method | Endpoint                         |
|--------|----------------------------------|
| GET    | `/api/v1/boards/{boardId}/tasks` |
| POST   | `/api/v1/boards/{boardId}/tasks` |
| GET    | `/api/v1/tasks/{taskId}`         |
| PUT    | `/api/v1/tasks/{taskId}`         |
| PATCH  | `/api/v1/tasks/{taskId}/status`  |
| DELETE | `/api/v1/tasks/{taskId}`         |

---

## Database Migrations

| Migration | What it creates               |
|-----------|-------------------------------|
| V1        | `users`                       |
| V2        | `refresh_tokens`              |
| V3        | `workspaces`                  |
| V4        | `workspace_members`           |
| V5        | `boards`                      |
| V6        | `tasks`                       |
| V7        | `attachments`                 |

---

## Infrastructure

| Service    | Image                | Port      |
|------------|----------------------|-----------|
| PostgreSQL | `postgres:16-alpine` | 5433→5432 |
| Redis      | `redis:7-alpine`     | 6379      |
| Kafka      | KRaft (no ZooKeeper) | 9092      |

AWS S3 requires: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`

---

## Built by

**Pratik** — [@pratik20gb](https://github.com/pratik20gb) · [@thecod8r](https://x.com/thecod8r)

---

<div align="center">
  <sub>If this helped, a ⭐ is always appreciated.</sub>
</div>
