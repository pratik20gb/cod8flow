# COD8FLOW 🗂️

A full-stack project management SaaS application built with Java Spring Boot and React.
Inspired by Jira — built from scratch to learn industry-grade Java development end to end.

## 🚀 Tech Stack

### Backend
- **Java 21** — LTS version used in production by most companies
- **Spring Boot 3** — Industry standard Java framework
- **Spring Security + JWT** — Stateless authentication with access + refresh tokens
- **Spring Data JPA + Hibernate** — ORM for database operations
- **PostgreSQL** — Primary relational database
- **Flyway** — Database schema versioning and migrations
- **Redis** — Caching layer for performance
- **Apache Kafka** — Async event-driven notifications
- **AWS S3** — File and attachment storage

### Frontend
- **React 18 + TypeScript** — Type-safe component-based UI
- **React Query (TanStack)** — Server state management and caching
- **Axios** — HTTP client
- **Tailwind CSS** — Utility-first styling
- **Zustand** — Client-side state management
- **React Router** — Client-side routing

### DevOps & Observability
- **Docker + Docker Compose** — Containerized local development
- **GitHub Actions** — CI/CD pipeline
- **Prometheus + Grafana** — Metrics and monitoring dashboards
- **Logback** — Structured logging

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              React 18 + TypeScript                   │
│         React Query · Zustand · Tailwind             │
└─────────────────────┬───────────────────────────────┘
                      │ REST / JSON
┌─────────────────────▼───────────────────────────────┐
│                Spring Boot 3                         │
│                                                      │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │   Auth      │ │   Project    │ │ Notification │  │
│  │  Service    │ │   Service    │ │   Service    │  │
│  └─────────────┘ └──────────────┘ └──────────────┘  │
│                                                      │
│  Spring MVC · Spring Data JPA · Spring Security      │
└──────┬──────────────┬──────────┬────────────┬───────┘
       │              │          │            │
┌──────▼───┐  ┌───────▼──┐ ┌────▼────┐ ┌────▼────┐
│PostgreSQL│  │  Redis   │ │  Kafka  │ │  AWS S3 │
│ Flyway   │  │  Cache   │ │ Events  │ │  Files  │
└──────────┘  └──────────┘ └─────────┘ └─────────┘
```

## 📁 Project Structure

```
src/main/java/com/cod8flow/
├── config/          # Spring configuration (Security, Redis, S3)
├── controller/      # REST controllers — HTTP layer
├── service/         # Business logic layer
├── repository/      # Database access layer
├── domain/
│   ├── entity/      # JPA entities (User, Workspace, Board, Task)
│   └── enums/       # TaskStatus, Priority, Role
├── dto/
│   ├── request/     # Incoming request bodies
│   └── response/    # Outgoing response bodies
├── exception/       # Custom exceptions + global error handler
├── security/        # JWT filter + UserDetails implementation
└── util/            # Helper classes

src/main/resources/
├── db/migration/    # Flyway SQL migrations (V1__, V2__, ...)
└── application.yml  # Application configuration
```

## 🛠️ Getting Started

### Prerequisites

- Java 21
- Docker Desktop
- Maven (included via `./mvnw` wrapper)
- Git

### Clone the repository

```bash
git clone https://github.com/pratik20gb/cod8flow.git
cd cod8flow
```

### Start infrastructure

```bash
# Starts PostgreSQL and Redis in Docker
docker compose up -d
```

### Run the application

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

### Verify it's running

```bash
curl http://localhost:8080/api/v1/health
```

Expected response:
```json
{
  "status": "UP",
  "service": "COD8FLOW API",
  "version": "1.0.0",
  "timestamp": "2026-06-02T..."
}
```

---

## 🔌 API Endpoints
```
### Authentication
POST   /api/v1/auth/register     # Create a new account
POST   /api/v1/auth/login        # Login and get JWT tokens
POST   /api/v1/auth/refresh      # Refresh expired access token
### Workspaces
GET    /api/v1/workspaces        # List all workspaces
POST   /api/v1/workspaces        # Create a workspace
GET    /api/v1/workspaces/{id}   # Get workspace by ID
PUT    /api/v1/workspaces/{id}   # Update workspace
DELETE /api/v1/workspaces/{id}   # Delete workspace
### Boards
GET    /api/v1/workspaces/{id}/boards    # List boards in workspace
POST   /api/v1/workspaces/{id}/boards   # Create a board
GET    /api/v1/boards/{id}              # Get board by ID
DELETE /api/v1/boards/{id}              # Delete board
### Tasks
GET    /api/v1/boards/{id}/tasks        # List tasks on a board
POST   /api/v1/boards/{id}/tasks        # Create a task
GET    /api/v1/tasks/{id}               # Get task by ID
PUT    /api/v1/tasks/{id}               # Update task
PATCH  /api/v1/tasks/{id}/status        # Update task status only
DELETE /api/v1/tasks/{id}               # Delete task
### Health & Monitoring
GET    /api/v1/health            # Application health check
GET    /actuator/health          # Spring Actuator health
GET    /actuator/metrics         # Application metrics
---
```
## 📊 Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Project setup, Docker, Flyway, Health endpoint | ✅ Complete |
| Phase 2 | JWT Authentication — register, login, refresh | 🔄 In Progress |
| Phase 3 | Core domain — workspaces, boards, tasks | ⏳ Pending |
| Phase 4 | Redis caching + AWS S3 file uploads | ⏳ Pending |
| Phase 5 | Kafka events + email notifications | ⏳ Pending |
| Phase 6 | Testing — JUnit, Mockito, Testcontainers | ⏳ Pending |
| Phase 7 | React frontend + CI/CD + Grafana | ⏳ Pending |

---
```
## 🔐 Authentication Flow
POST /auth/register
→ Password hashed with BCrypt
→ User saved to PostgreSQL
→ Access token (15 min) + Refresh token (7 days) returned
POST /auth/login
→ Email + password verified
→ New access + refresh tokens returned
Every protected request
→ Authorization: Bearer <access_token> header required
→ JWT filter validates signature and expiry
→ 401 Unauthorized if missing or invalid
```
## 🐳 Docker Services

| Service | Image | Port |
|---------|-------|------|
| PostgreSQL | postgres:16-alpine | 5432 |
| Redis | redis:7-alpine | 6379 |

---

## 📝 Database Migrations

Managed by Flyway. Migration files live in `src/main/resources/db/migration/`.

| Version | Description |
|---------|-------------|
| V1 | Create users table |

New migrations are added as `V2__description.sql`, `V3__description.sql` etc. Never edit an existing migration file.

---

## 🧪 Testing Strategy

- **Unit tests** — JUnit 5 + Mockito for service layer
- **Integration tests** — Testcontainers (real PostgreSQL in Docker)
- **API tests** — MockMvc for controller layer
- **Coverage target** — 80%+

---

## 📈 Monitoring

Once Phase 7 is complete:
- Prometheus scrapes metrics from `/actuator/prometheus`
- Grafana dashboard visualizes request rates, response times, error rates
- Structured logs via Logback with timestamp, thread, level, and class

---

## 🤝 Contributing

This is a personal learning project. Feel free to fork it and build your own version.

---

## 👨‍💻 Author

**Pratik** — [@pratik20gb](https://github.com/pratik20gb)

Built as a complete full-stack Java learning project — from zero to production-grade.

---

## 📄 License

MIT License — free to use and learn from.