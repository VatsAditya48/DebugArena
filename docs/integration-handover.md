# DebugArena — Integration Handover

**Document date:** 7 November 2026  
**Prepared by:** Aditya Vatsa (Project Lead / Backend Integration)  
**Temporary technical lead:** Abhay  
**Unavailability window:** 11–16 November 2026  
**Submission deadline:** 17 November 2026

> This document records the setup and decisions currently known. Items marked **Verify** must be checked against the latest branch, pull request, or team update before integration. Do not assume a module is complete just because its owner has started it.

---

## 1. Project overview

**DebugArena** is an AI-powered, proctored technical assessment platform focused on debugging assessments.

The current submission target is the core MVP: project foundation, authentication, and recruiter-side assessment management. Candidate assessment sessions, isolated code execution, proctoring, AI evaluation, and analytics are later-stage capabilities unless the team explicitly agrees to bring a specific part into the MVP.

### MVP phases

| Phase | Scope | Current handover note |
|---|---|---|
| Phase 0 — Foundation | FastAPI app, React app, configuration, CORS, PostgreSQL connectivity, API structure | Aditya's backend foundation and Docker/PostgreSQL connection were manually checked. Frontend foundation status: **verify with Shristi**. |
| Phase 1 — Authentication | Users, organizations/memberships, registration/login, password hashing, sessions/tokens, roles, organization isolation | Vishu owns the authentication module. Latest completion status and API contract: **verify**. |
| Phase 2 — Assessments | Assessment/challenge/test-case APIs, draft/publish flow, recruiter UI | Abhay owns the assessment API; Shairraf owns frontend API integration and recruiter assessment UI. Latest completion status: **verify**. |

Do not expand the 17 November MVP scope without agreement from the acting technical lead and project lead.

---

## 2. Repository and Git workflow

**GitHub repository:** https://github.com/VatsAditya48/DebugArena  
**Local clone used by Aditya:** `C:\Users\adity\DebugArena`

### Branch conventions

- `main` — stable release branch. Do not push feature work directly to `main`.
- `develop` — shared integration branch. Feature pull requests target `develop`.
- `feature/backend-foundation` — Aditya
- `feature/frontend-foundation` — Shristi
- `feature/database-setup` — Vaishnavi
- `feature/authentication` — Vishu
- `feature/assessment-api` — Abhay
- `feature/assessment-ui` — Shairraf

Branch names above reflect the agreed setup; check the live repository before acting because branches may have been renamed or updated.

### Standard contributor workflow

From the repository directory in PowerShell / Git Bash:

```bash
git status
git fetch origin
git switch develop
git pull origin develop
git switch -c feature/<your-name>-<task>
```

After making and testing changes:

```bash
git status
git add <changed-files>
git commit -m "Describe the change"
git push -u origin <your-branch>
```

Open a pull request from the feature branch **into `develop`**. Include what changed, how it was tested, screenshots where relevant, and any migration/configuration steps.

### Integration rules

1. Do not push directly to `main`.
2. Do not merge an unreviewed or failing pull request merely to meet the date. Ask the owner to fix it, or document the blocker and risk.
3. Keep pull requests focused and reasonably small. Avoid mixing unrelated modules.
4. Before resolving a conflict, fetch the latest `develop` and inspect the conflicting files. Do not force-push or reset shared branches as a shortcut.
5. The original module owner remains responsible for fixing defects in that module. The acting lead coordinates and helps unblock; they should not silently take ownership of every unfinished task.
6. Promote `develop` to `main` only after the agreed MVP integration checks pass.

---

## 3. Team ownership and temporary responsibilities

| Member | Regular ownership | During 11–16 November |
|---|---|---|
| **Aditya** | Project lead; backend foundation and integration | Unavailable. Decisions and current setup should be documented before 10 November EOD. |
| **Abhay** | Assessment APIs, Docker/infrastructure, backend testing foundation | **Acting Technical Integration Lead.** Coordinates backend integration, reviews/coordinates PRs into `develop`, tracks blockers, and reports project status. Continues to own assessment API and infrastructure work. |
| **Shairraf** | Frontend integration; API service layer, auth integration, protected routes, recruiter assessment UI | **Frontend Integration Coordinator.** Coordinates API/UI integration with Shristi and reports frontend blockers to Abhay. |
| **Vaishnavi** | Database schema, ERD, SQLAlchemy models, Alembic migrations | Continues database ownership; supports Abhay and backend owners with schema/migration compatibility. |
| **Vishu** | Authentication APIs, password hashing, token/session auth, RBAC and organization isolation | Continues authentication ownership; fixes auth defects and coordinates contract changes with Abhay/Shairraf. |
| **Shristi** | Frontend foundation, React/TypeScript/Vite/Tailwind layouts and pages | Continues frontend ownership; fixes UI defects and coordinates with Shairraf. |

**Important:** Abhay is the temporary technical coordinator, not the sole developer for every module. Each owner must continue to finish, test, and support their assigned work.

---

## 4. Local development environment

### 4.1 Prerequisites

- Windows 11 (the setup below uses PowerShell commands).
- Python 3.11 (Aditya's tested version was Python 3.11.9).
- Docker Desktop with Docker Engine running.
- Git.
- Node.js/npm for the frontend (confirm the version required by the current frontend project files; do not assume a version).

### 4.2 Start PostgreSQL with Docker Compose

Run these commands from the **repository root**:

```powershell
docker compose -f infrastructure/docker-compose.yml up -d
docker ps
```

Expected container name: `debugarena-postgres`. The Compose service uses PostgreSQL 17 and a persistent Docker volume named `postgres_data`.

Check container logs / readiness:

```powershell
docker compose -f infrastructure/docker-compose.yml logs --tail=50 postgres
```

If the service name differs in the current Compose file, inspect `infrastructure/docker-compose.yml` and use the actual service name in the logs command.

**Port mapping:** Windows host `127.0.0.1:5433` maps to PostgreSQL inside the container on port `5432`. This was chosen because a native PostgreSQL 18 Windows service was already using host port `5432` on Aditya's machine.

To stop the container without deleting the database volume:

```powershell
docker compose -f infrastructure/docker-compose.yml down
```

**Never use `docker compose down -v` for routine shutdown.** The `-v` option deletes the Compose-managed database volume and can erase local database data.

### 4.3 Backend environment variables

There are two separate local environment files:

- Repository root `.env` — Docker Compose/PostgreSQL variables.
- `backend/.env` — FastAPI application settings, including the SQLAlchemy database URL.

Safe templates are provided as `.env.example` files. Each developer should create their own local `.env` from the relevant template and use credentials agreed by the team.

**Never commit either real `.env` file. Never paste passwords, tokens, or complete connection strings into GitHub issues, pull requests, screenshots, or this handover document.** If a credential was exposed, rotate it.

For the current local Docker mapping, the backend database URL should use:

```text
postgresql+psycopg://<database-user>:<database-password>@127.0.0.1:5433/<database-name>
```

Replace the placeholders locally. Do not use the actual password in shared documentation.

### 4.4 Install and run the backend

In PowerShell:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

If `.venv` already exists, do not recreate it unnecessarily; activate it and install requirements only when needed. If PowerShell blocks activation, use the team's approved local activation method rather than changing machine-wide execution policy without understanding the effect.

The API should be available at:

- Base URL: `http://127.0.0.1:8000`
- Interactive API documentation: `http://127.0.0.1:8000/docs`

### 4.5 Useful health checks

Open these URLs in a browser, or test with `curl.exe`:

| Endpoint | Expected purpose |
|---|---|
| `GET /` | Basic API/root response |
| `GET /api/v1/health` | Backend health check |
| `GET /api/v1/health/database` | Checks a real database query (`SELECT 1`) |
| `GET /docs` | FastAPI Swagger UI |

Example PowerShell checks:

```powershell
curl.exe -i http://127.0.0.1:8000/
curl.exe -i http://127.0.0.1:8000/api/v1/health
curl.exe -i http://127.0.0.1:8000/api/v1/health/database
```

The database health endpoint should return HTTP 200 with a healthy/connected response when the backend can query PostgreSQL. If it returns 503, check Docker container health, host port `5433`, and the local `backend/.env` database URL. Do not share the password while troubleshooting.

### 4.6 Frontend

Frontend stack: React, TypeScript, Tailwind CSS, and Vite.

**Verify with Shristi/Shairraf** the current frontend directory and package scripts before running commands. In the frontend project directory, the usual workflow is:

```powershell
npm install
npm run dev
```

The backend CORS configuration currently allows the local Vite origin `http://localhost:5173`. If the frontend runs on a different origin/port, coordinate the change and update local configuration rather than disabling CORS.

---

## 5. Backend foundation — known implementation

The following Phase 0 backend work was implemented by Aditya and manually checked in the local environment:

- FastAPI application entry point: `backend/app/main.py`.
- Pydantic settings/configuration: `backend/app/core/config.py`.
- SQLAlchemy engine and session dependency: `backend/app/db/database.py` (verify exact path/name in the latest branch if it has since been reorganized).
- Central API v1 router: `backend/app/api/v1/router.py`.
- Health endpoints: `backend/app/api/v1/endpoints/health.py`.
- CORS configured from settings, with local Vite origin allowed.
- Application logging configured in `backend/app/core/logging_config.py`.
- Consistent HTTP, validation, and generic exception handlers in `backend/app/core/exception_handlers.py`.
- `backend/requirements.txt` includes backend dependencies.
- `backend/.env.example` documents the backend configuration keys.
- `docs/api-design.md` contains a **proposed** API design; treat it as a starting point and reconcile it with the actual auth/assessment implementations before calling it final.

### Verification already reported by Aditya

- `python -m compileall app` passed.
- Root endpoint, health endpoint, Swagger docs, and custom 404 response were manually checked.
- CORS preflight from `http://localhost:5173` was manually checked successfully.
- SQLAlchemy connected to Docker PostgreSQL and identified the expected database/user.
- `GET /api/v1/health/database` was confirmed working after the Docker host-port change.

### Verification not established in this handover

- A complete automated pytest run across the integrated application has **not** been confirmed here.
- Authentication, assessment APIs, frontend integration, and migrations must be tested against the latest merged code.
- Do not treat manual Phase 0 checks as proof that all integrated MVP flows pass.

---

## 6. Infrastructure and database notes

- Compose file: `infrastructure/docker-compose.yml`.
- Infrastructure guidance: `infrastructure/README.md`.
- PostgreSQL image: PostgreSQL 17 (confirm the exact tag in the current Compose file).
- Container: `debugarena-postgres` (confirm with `docker ps`).
- Host binding: `127.0.0.1:5433` → container port `5432`.
- Persistent volume: `postgres_data`.
- Root `.env.example` documents Docker Compose variables; `backend/.env.example` documents application variables. They serve different purposes.
- Vaishnavi owns the final schema/models/migrations. Before integration, Abhay should verify migration order, a clean-database upgrade, and compatibility with Vishu's auth and Abhay's assessment models.

Do not manually edit production-like database tables to work around migration conflicts. Coordinate schema changes through SQLAlchemy models and Alembic migrations, and preserve existing local data unless the team explicitly agrees to reset a disposable development database.

---

## 7. API contract and integration coordination

- Backend API base: `http://127.0.0.1:8000`.
- Versioned API prefix: `/api/v1`.
- Swagger UI: `http://127.0.0.1:8000/docs`.
- API design notes: `docs/api-design.md`.

Before connecting modules, the owners should agree on:

1. Exact endpoint paths and HTTP methods.
2. Request and response JSON field names and types.
3. Authentication mechanism and how the frontend sends credentials/tokens.
4. Role and organization authorization rules.
5. Consistent error response shape and status codes.
6. Database ownership, foreign keys, and migration dependencies.

Swagger on the running backend is the best immediate view of the implemented API. If `docs/api-design.md` disagrees with the running implementation, raise the mismatch and agree on the contract; do not silently build the frontend against an outdated proposal.

---

## 8. Integration checklist for 8–10 November

### Before integration — target: 9 November EOD

- [ ] Every member posts a progress update using the agreed team format.
- [ ] Each member pushes their latest work to their feature branch.
- [ ] Each completed module has a pull request into `develop`.
- [ ] Pull requests describe changes and include test evidence.
- [ ] No real `.env`, passwords, tokens, or private credentials are tracked by Git.
- [ ] Database models and migrations are reviewed with Vaishnavi.
- [ ] Authentication/API contract is aligned between Vishu and Shairraf.
- [ ] Assessment API/UI contract is aligned between Abhay and Shairraf.
- [ ] Unfinished work is listed with owner, blocker, and expected completion date.

### Integration day — 10 November

- [ ] Fetch latest `develop`; confirm working tree is clean before switching/merging.
- [ ] Start PostgreSQL with Docker Compose and confirm the container is healthy.
- [ ] Install backend requirements in the project virtual environment.
- [ ] Run the backend and check `/`, `/api/v1/health`, `/api/v1/health/database`, and `/docs`.
- [ ] Apply database migrations from a clean, disposable development database and verify the upgrade path.
- [ ] Test registration/login and role/organization access rules.
- [ ] Test assessment/challenge/test-case create, read, update, and publish flows that are in MVP scope.
- [ ] Run the available automated tests (record the exact command and result).
- [ ] Run the frontend and test the integrated recruiter flow against the backend.
- [ ] Record failed checks, severity, owner, and workaround; do not label a failing flow complete.
- [ ] Walk Abhay through the repository, local setup, outstanding PRs, and known integration risks.

### Handover acceptance — 10 November EOD

Abhay should be able to independently:

- [ ] Pull the latest `develop` branch.
- [ ] Start Docker PostgreSQL and the backend locally.
- [ ] Verify the database health endpoint.
- [ ] Identify module owners and find the API contract / Swagger docs.
- [ ] Review a PR, request changes, and coordinate a merge into `develop` under the repository's normal permissions/rules.
- [ ] Explain the known blockers, incomplete flows, and next actions.

---

## 9. Daily progress update format

Each member should post updates in the team channel using this format:

```text
Name:
Assigned Module/Task:
Current Status: Not Started / In Progress / Completed
Completed So Far:
Pending Work:
Blockers (if any):
Expected Completion Date:
GitHub Branch / PR Link:
Test Evidence:
```

A task should be marked **Completed** only when the code is pushed, the relevant checks have been run, and any required PR is ready for review or has been merged. Clearly label work that is implemented but not yet tested.

---

## 10. Issue escalation while Aditya is unavailable

1. The module owner first investigates and shares the error, reproduction steps, relevant logs (with secrets removed), and affected branch/PR.
2. Database/model/migration issue → Vaishnavi; authentication/RBAC issue → Vishu; assessment API/infrastructure issue → Abhay; frontend/UI issue → Shristi; frontend API integration issue → Shairraf.
3. Abhay coordinates cross-module blockers and decides the order of integration work. Shairraf coordinates frontend dependencies with Shristi.
4. For a blocker that risks the 17 November submission, Abhay records the impact, owner, options, and decision in the team channel/issue tracker. Avoid scope expansion and risky last-minute rewrites.
5. Preserve the working `develop` branch. Do not force-push, delete shared branches, remove database volumes, or bypass failing checks to make the board look complete.

---

## 11. Open items to verify before handover is final

- [ ] Confirm all members' latest branch names and PR links in GitHub.
- [ ] Confirm whether the repository is still public; if it is, ensure no secrets or private information are committed and review whether the team intends to keep it public.
- [ ] Confirm Abhay and Shairraf can perform the GitHub actions they need (push their branches, open PRs, review, and merge where repository rules permit).
- [ ] Confirm the latest status of Shristi's frontend foundation, Vaishnavi's models/migrations, Vishu's authentication, Abhay's assessment APIs, and Shairraf's frontend integration.
- [ ] Confirm the actual current frontend directory and npm scripts.
- [ ] Confirm the final automated test command and test coverage available in the repository.
- [ ] Confirm the final database schema and migration workflow with Vaishnavi.
- [ ] Confirm any environment-variable additions are reflected in the appropriate `.env.example` files.
- [ ] Confirm all local credentials are private and any previously exposed database credential has been rotated.

**Handover status:** Draft prepared from the project setup and test results known on 7 November 2026. Update the open items and current module statuses before treating this as the final 10 November handover.
