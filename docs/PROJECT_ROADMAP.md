# Logic Looper — Execution Roadmap (Step-by-Step)

This roadmap is based on a review of the current codebase and aligns your target architecture with what is already implemented.

## 0) Current Codebase Review Snapshot

### Already implemented (good foundation)
- React + Vite frontend scaffold with routing, login page, game page, and heatmap section.
- Firebase auth integration in frontend.
- Client-side puzzle architecture with multiple puzzle types and a factory-based generator.
- IndexedDB integration (`idb`) with a `dailyActivity` model and activity update events.
- Client-side streak and heatmap logic with deterministic date processing.
- Minimal Express + Prisma backend with PostgreSQL schema bootstrap.

### Major gaps vs your target specification
- No Redux Toolkit store wired into app state yet.
- No automated test suite (Jest/RTL) and no coverage enforcement.
- Backend sync API (`POST /sync/daily-scores`) and validation rules are not implemented.
- Server schema is incomplete for `daily_scores` and `user_stats`.
- Guest mode fallback and Truecaller integration are not implemented.
- No explicit PWA/service-worker support for full offline installability.

---

## 1) Full Project Steps (Do each step separately)

### Step 1 — Foundation Hardening (Do this first)
1. Lock architecture + conventions (state boundaries, folder ownership, naming).
2. Add quality gates: ESLint cleanup baseline, Prettier, test runner setup, CI scripts.
3. Introduce Redux Toolkit store skeleton (auth, puzzle, activity slices).
4. Define shared Type Contracts (JSDoc typedefs for puzzle/activity payloads).
5. Add environment contract docs (`.env.example` for frontend + backend).
6. Confirm local runbook for frontend/server/db.

**Exit criteria for Step 1:**
- `npm run lint` passes.
- Test infra exists and a smoke test passes.
- Store is mounted and app still runs.

### Step 2 — Authentication Completion
1. Keep Firebase Google auth path stable.
2. Add guest mode (no backend dependency).
3. Add auth abstraction layer so providers are pluggable.
4. Prepare Truecaller integration adapter (feature-flagged if web SDK constraints apply).

**Exit criteria:** login, logout, and guest session all work.

### Step 3 — Puzzle Engine Stabilization
1. Replace date-only seed with SHA256(date + app secret).
2. Ensure deterministic puzzle generation for same date/device.
3. Tighten validator and anti-tamper score bounds.
4. Add test vectors for each puzzle type.

**Exit criteria:** same date => same puzzle; invalid solutions rejected.

### Step 4 — Daily Unlock + Progress Lifecycle
1. Enforce today-unlocked logic.
2. Preserve partial progress and completion states in IndexedDB.
3. Implement local midnight rollover handling.
4. Add retry/resume rules and lock semantics for missed days.

### Step 5 — Heatmap Production Module
1. Keep current heatmap grid and polish with tooltips + highlight + animation.
2. Add intensity mapping tied to score/time/difficulty.
3. Add leap-year and timezone edge-case tests.
4. Add year switching support for future extension.

### Step 6 — Backend Sync (Minimal Writes)
1. Add Prisma models for `daily_scores` and `user_stats`.
2. Implement `POST /sync/daily-scores` with upsert and validation.
3. Add dedupe by `(user_id, date)` and reject future dates.
4. Batch sync unsynced IndexedDB entries on reconnect.

### Step 7 — Engagement + Retention Layer
1. Streak milestones and achievements.
2. Hint quota per day with penalties.
3. Lightweight leaderboard endpoint (top 100 only).
4. Optional shareable challenge URLs.

### Step 8 — PWA + Performance + Demo Readiness
1. Add service worker and offline shell behavior.
2. Enforce bundle/perf budgets and Lighthouse checks.
3. Final UI polish, responsive QA, and browser compatibility matrix.
4. Demo script and presentation checklist automation.

---

## 2) Step 1 Detailed Process (Start Here Now)

### Step 1.1 — Baseline Cleanup
- Remove dead imports/components and fix lint errors.
- Standardize formatting across `src` and `server`.
- Verify app boot in both frontend and backend.

### Step 1.2 — Quality Tooling
- Add test stack: `jest`, `@testing-library/react`, `@testing-library/jest-dom`.
- Add scripts:
  - `test`
  - `test:watch`
  - `test:coverage`
- Add minimum coverage threshold config (start at 60%, increase later).

### Step 1.3 — State Management Skeleton
- Create `src/store/index.js`.
- Create slices:
  - `authSlice`
  - `puzzleSlice`
  - `activitySlice`
- Wrap app in `<Provider store={store}>` in `main.jsx`.

### Step 1.4 — Shared Contracts
- Add `src/types/contracts.js` (JSDoc typedefs) for:
  - `DailyActivity`
  - `PuzzlePayload`
  - `SyncEntry`
- Refactor service functions to consume contract-shaped objects.

### Step 1.5 — Environment & Runbook
- Add `.env.example` (frontend + server).
- Document local setup: install, run frontend, run backend, prisma migrate.

### Step 1.6 — Validation Checklist
Run these in order:
1. `npm run lint`
2. `npm run build`
3. `npm run test`
4. `node server/index.js` (smoke run)

If these pass, Step 1 is complete and we move to Step 2.

---

## 3) Recommended Team Split for Faster Delivery

- **Frontend Core:** Step 1, 3, 4, 5, 8
- **Backend/API:** Step 6 + auth sync boundaries in Step 2
- **UX/Animation:** Step 5 + Step 8 polish
- **QA/Automation:** test coverage, edge-case suite, release checklist

---

## 4) Next Action

We have now completed the project review and produced the full execution roadmap.

**Ready to execute Step 1 in code next.**
In the next iteration, we should implement Step 1.1 + 1.2 first (lint baseline + test infrastructure), then validate with commands.
