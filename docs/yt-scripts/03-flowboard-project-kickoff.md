# Video Script: Spring Boot + React: Building a Real Jira Clone From Scratch (Project Kickoff 2026)

**Target Length:** 18-24 min  
**Thumbnail:** Epic Jira clone one (1.jpg or the setup one)

## Hook
"Everyone talks about building side projects.
Today I'm showing you the **real** start of building a production-grade Jira clone using modern Java 21, Spring Boot, React, and PostgreSQL — the same stack used at real companies.

This is COD8FLOW. And we're doing it the hard (but correct) way: from zero, with proper architecture, Flyway, JWT, and a full React frontend."

## Why This Project? (2-6 min)
- Personal learning goal: industry-grade Java end-to-end
- Inspired by the README phases (show the table)
- What makes it different from "Employee Management System" tutorials: real SaaS concerns (auth, refresh, roles, later events, caching, S3)

## Tech Choices Deep Dive (6-12 min)
- Why Java 21 + Spring Boot  (LTS, ecosystem)
- Why not NestJS or Go for this one
- Postgres + Flyway (never edit migrations)
- JWT over sessions for this SaaS
- React + TS + Zustand + React Query + Tailwind (modern but not overkill)
- Docker from day 1

## Phase 1 Walkthrough (12-18 min)
- Docker Compose (postgres on 5433 + redis)
- mvnw spring-boot:run
- Flyway ran V1 + V2
- HealthController demo (curl)
- Current state of the codebase (what's committed)
- Teaser of what's next (JWT implementation coming in next videos)

## How to Follow Along
- GitHub link
- "Star the repo if you're following"
- Discord / X for questions

## End
"Next video: We implement the full JWT register + login + refresh that actually works with the frontend already built."

**Great for beginners + intermediate Java devs.**
