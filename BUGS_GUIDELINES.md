# Gig Galaxy – Interview Assessment Bug Guide

This document outlines **intentional bugs** introduced into the project for evaluation of candidates. The repository is expected **not to work** out‑of‑the‑box; the candidate’s task is to identify, diagnose, and fix the issues according to their difficulty level.

## 📊 Bug Levels

| Level | Example Bug | Hint to Fix |
|-------|-------------|------------|
| Junior | Missing `VITE_API_BASE_URL` env var | Add the variable to `.env` file. |
| Junior | Incorrect import path (`MODULE_NOT_FOUND`) | Correct the import statement to the proper relative path. |
| Intermediate | Incorrect CORS configuration in Docker | Update `cors.origin` to include Docker network host or use `*` for development. |
| Intermediate | Socket.IO namespace mismatch (`/chat` vs `/messages`) | Align client and server namespaces to the same value. |
| Advanced | JWT verification uses wrong secret | Ensure access tokens are signed/verified with `JWT_SECRET`, not the refresh secret. |
| Advanced | Unvalidated user input causing NoSQL injection | Validate and sanitize all request data before querying MongoDB. |

## 🛠 How Candidates Should Approach
1. **Run the project** (`docker compose up --build`). Observe the failing behavior and error messages.
2. **Identify the failing level** based on the symptoms (e.g., missing env var → Junior; CORS issue → Intermediate).
3. **Fix the bug** by editing the appropriate code, configuration, or Docker files.
4. **Document the fix** in a Git commit message that mentions the bug level (e.g., `fix(junior): add missing VITE_API_BASE_URL`).
5. **Verify** that the application starts without errors and the intended feature works.

## 📁 Where the Bugs Reside
- **Junior** bugs are scattered across the `README.md`, `.env.example`, and basic TypeScript files (`src/services/api.ts`).
- **Intermediate** bugs are primarily located in `backend/src/socket.ts`, `backend/src/middleware/auth.ts`, and `docker-compose.yml`.
- **Advanced** bugs are hidden in security‑critical sections such as `backend/src/utils/jwt.ts`, database query builders, and the global error handler.

> **Note to interviewers:** Feel free to adjust the severity of each bug or add additional ones to match the desired assessment depth.
