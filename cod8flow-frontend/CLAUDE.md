# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Type-check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test suite exists yet — Phase 7 is still being built out.

## Architecture

React 19 + TypeScript + Tailwind CSS 4 + Vite 8 frontend for the cod8flow project management app. It talks to a Spring Boot backend at `http://localhost:8080/api/v1`.

**Data flow:**
```
Page component → api/*.api.ts → src/api/client.ts (axios) → Spring Boot backend
                     ↑
              store/auth.store.ts (Zustand)
```

**Key directories:**

| Path | Contents |
|---|---|
| `src/api/client.ts` | Axios instance — auto-attaches `Authorization: Bearer` from localStorage; redirects to `/login` on 401 |
| `src/api/*.api.ts` | Per-domain API functions (auth, workspace, board, task) |
| `src/store/auth.store.ts` | Zustand auth store — holds `accessToken`, `refreshToken`, `user`, `isAuthenticated`; persists tokens to localStorage |
| `src/types/index.ts` | Shared TypeScript interfaces for all API request/response shapes |
| `src/pages/` | One file per route/page |

## Auth Flow

`useAuthStore.initialize()` is called in `App.tsx` on mount to rehydrate tokens from localStorage. On 401 the axios interceptor clears storage and hard-redirects to `/login`. Token refresh is not yet implemented — a 401 logs the user out.

## Backend Contract

All types in `src/types/index.ts` mirror the Spring Boot DTOs. Enums `TaskStatus` and `Priority` must stay in sync with the backend enums in `domain/enums/`.

## Phase Status

This repo is the Phase 7 frontend. The backend (`cod8flow` repo) through Phase 6 is the API source of truth. Dashboard and Register pages are stubs — only Login is wired end-to-end.
