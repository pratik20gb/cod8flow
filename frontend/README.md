# FlowBoard Frontend

React + TypeScript frontend for FlowBoard.

## Scripts

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` requests to the Spring Boot backend on `http://localhost:8080`.

## Current Scope

- Login and register screens for `/api/v1/auth/login` and `/api/v1/auth/register`
- Persisted JWT session with Zustand
- Protected board route at `/`
- Starter board UI for the project management workflow
