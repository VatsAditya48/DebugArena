# DebugArena Backend – Database Setup

## Prerequisites
- Python 3.12+
- Docker Desktop
- PostgreSQL 17 (through Docker Compose)

## Start PostgreSQL

From the project root:

```powershell
docker compose --env-file .env -f infrastructure/docker-compose.yml up -d
```

## Configure Environment

Create `backend/.env` using `backend/.env.example`.

Set the database URL:

```env
DATABASE_URL=postgresql+psycopg://debugarena_user:YOUR_PASSWORD@127.0.0.1:5433/debugarena
```

Replace `YOUR_PASSWORD` with your local PostgreSQL password.

## Install Dependencies

From the backend directory:

```powershell
python -m pip install -r requirements.txt
```

## Database Migrations

Check the current migration:

```powershell
alembic current
```

Generate a migration after creating or changing models:

```powershell
alembic revision --autogenerate -m "describe database changes"
```

Review the generated migration before applying it.

Apply migrations:

```powershell
alembic upgrade head
```

View migration history:

```powershell
alembic history
```

Roll back one migration:

```powershell
alembic downgrade -1
```

**Important:** Never commit `.env` files or database passwords. Do not use `docker compose down -v` on a database containing data.
