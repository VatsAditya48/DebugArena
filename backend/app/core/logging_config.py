
import logging


def configure_logging(environment: str) -> logging.Logger:

    # Select logging level based on application environment
    log_level = (
        logging.DEBUG
        if environment.lower() == "development"
        else logging.INFO
    )

    # Create the application logger
    logger = logging.getLogger("debugarena")
    logger.setLevel(log_level)

    # Configure a console handler only once
    if not logger.handlers:

        handler = logging.StreamHandler()

        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )

        handler.setFormatter(formatter)
        logger.addHandler(handler)

    logger.propagate = False

    return logger
