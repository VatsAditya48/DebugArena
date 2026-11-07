DebugArena Infrastructure

PostgreSQL Database

DebugArena uses PostgreSQL 17 as its primary relational database.

PostgreSQL runs inside a Docker container using Docker Compose.

Configuration

Environment Setup

Copy the example environment file to create your local configuration:

cp .env.example .env

Update the POSTGRES_PASSWORD value in .env with a secure password.

The actual .env file contains private credentials and must never be committed to Git.

Property	Value
Database	debugarena
Username	debugarena_user
Host	localhost
Port	5432
PostgreSQL Version	17
Container Name	debugarena-postgres

Database credentials are configured through environment variables in the root .env file.

Prerequisites

* Docker Desktop
* Docker Compose

Start PostgreSQL

Run from the project root:

docker compose --env-file .env -f infrastructure/docker-compose.yml up -d

Check Database Status

docker compose --env-file .env -f infrastructure/docker-compose.yml ps

View Database Logs

docker compose --env-file .env -f infrastructure/docker-compose.yml logs postgres

Connect to PostgreSQL

docker exec -it debugarena-postgres psql -U debugarena_user -d debugarena

Stop PostgreSQL

docker compose --env-file .env -f infrastructure/docker-compose.yml stop

Restart PostgreSQL

docker compose --env-file .env -f infrastructure/docker-compose.yml start

Remove PostgreSQL Container

docker compose --env-file .env -f infrastructure/docker-compose.yml down

The named Docker volume preserves database data when containers are stopped or removed using the commands above.

Warning: Do not use docker compose down -v unless you intentionally want to delete the persistent database volume and its data.
