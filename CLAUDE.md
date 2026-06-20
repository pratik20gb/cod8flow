# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start all infrastructure (PostgreSQL on 5433, Redis on 6379, Kafka on 9092)
docker compose up -d

# Run the application
./mvnw spring-boot:run          # Linux/Mac
mvnw.cmd spring-boot:run        # Windows

# Build (skip tests)
./mvnw package -DskipTests

# Run all tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=Cod8flowApplicationTests

# Compile only
./mvnw compile
```

## Architecture

Spring Boot 4.0 / Java 21 backend only — no frontend in this repo yet (Phase 7).

**Package root:** `com.cod8flow.cod8flow`

**Layered flow:**
```
Controller → Service → Repository → Entity
                ↑
             dto/request · dto/response
```

**Key packages:**

| Package | Contents |
|---|---|
| `config/` | `SecurityConfig`, `RedisConfig`, `S3Config`, `KafkaConfig` |
| `security/` | `JwtAuthFilter`, `JwtService`, `UserDetailsServiceImpl` |
| `controller/` | One controller per domain + `HealthController` |
| `service/` | Business logic; `TaskEventProducer` publishes Kafka events |
| `consumer/` | `TaskEventConsumer` — Kafka listener for `task-assigned` topic |
| `event/` | `TaskAssignedEvent` — the Kafka event payload |
| `domain/entity/` | `User`, `Workspace`, `WorkspaceMember`, `Board`, `Task`, `Attachment` |
| `domain/enums/` | `Role`, `WorkspaceRole`, `TaskStatus`, `Priority` |
| `repository/` | Spring Data JPA repositories, one per entity |
| `dto/request/` | `@Valid` annotated request bodies |
| `dto/response/` | API response models |
| `exception/` | Custom exceptions + global `@ControllerAdvice` |

## Infrastructure

Docker Compose services (all required to run the app):

| Service | Port | Notes |
|---|---|---|
| PostgreSQL 16 | 5433 (host) → 5432 | `cod8flow_db`, user `cod8flow` |
| Redis 7 | 6379 | Cache TTL = 10 min (`time-to-live: 600000`) |
| Kafka | 9092 | KRaft mode (no ZooKeeper), topic: `task-assigned` |

AWS S3 credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`) must be set in `.env` or environment for attachment endpoints to work.

## Database Migrations

Flyway manages all schema changes. Files in `src/main/resources/db/migration/` follow `V{N}__{description}.sql`. Never edit a migration that has already been applied.

Current migrations: V1 (users) → V2 (refresh_tokens) → V3 (workspaces) → V4 (workspace_members) → V5 (boards) → V6 (tasks) → V7 (attachments).

JPA is set to `ddl-auto: validate` — Hibernate never modifies schema; Flyway is the sole source of truth.

## JWT Configuration

Tokens are configured in `application.yml` under `application.jwt`:
- Access token: 15 min (`900000` ms)
- Refresh token: 7 days (`604800000` ms)
- Secret: static hex string in `application.yml` (dev only — externalize for production)

## Testing (Phase 6 — in progress)

Currently only a single context-load smoke test exists (`Cod8flowApplicationTests`). Phase 6 is building out unit, integration, and API tests. Test dependencies added: `spring-boot-starter-test` + `spring-security-test`.

The `@SpringBootTest` context load test requires all infrastructure (Postgres, Redis, Kafka) to be running.

## Phase Roadmap

| Phase | Status |
|---|---|
| 1 — Core setup, Docker, Flyway, health | Done |
| 2 — JWT auth (register/login/refresh) | Done |
| 3 — Workspaces, Boards, Tasks domain | Done |
| 4 — Redis caching + AWS S3 attachments | Done |
| 5 — Kafka event bus + notifications | Done |
| **6 — Testing suite** | **In Progress** |
| 7 — Frontend, CI/CD, monitoring | Pending |
