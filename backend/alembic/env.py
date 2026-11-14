
from logging.config import fileConfig

from alembic import context

from app.core.config import settings
from app.core.database import engine
from app.models.base import Base
import app.models

# Alembic configuration
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Use the application's existing database URL.
# Escape percent signs for ConfigParser compatibility.
database_url = settings.database_url.replace("%", "%%")
config.set_main_option("sqlalchemy.url", database_url)

# SQLAlchemy metadata for migration autogeneration.
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations without creating a database connection."""

    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations using the application's existing engine."""

    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
