
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


# Get the shared application logger
logger = logging.getLogger("debugarena")


def register_exception_handlers(app: FastAPI) -> None:

    # 1. Handle HTTP exceptions (400, 401, 403, 404, etc.)
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request,
        exc: StarletteHTTPException,
    ):
        message = (
            exc.detail
            if isinstance(exc.detail, str)
            else "The request could not be completed."
        )

        logger.info(
            "HTTP error %s on %s %s",
            exc.status_code,
            request.method,
            request.url.path,
        )

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": "http_error",
                    "message": message,
                }
            },
            headers=exc.headers,
        )

    # 2. Handle request validation errors (422)
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        logger.warning(
            "Request validation failed on %s %s",
            request.method,
            request.url.path,
        )

        # Return useful validation information without exposing
        # the submitted input values.
        errors = [
            {
                "location": ".".join(str(part) for part in error["loc"]),
                "message": error["msg"],
                "type": error["type"],
            }
            for error in exc.errors()
        ]

        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "validation_error",
                    "message": "Request validation failed.",
                    "details": errors,
                }
            },
        )

    # 3. Handle unexpected server errors (500)
    @app.exception_handler(Exception)
    async def unexpected_exception_handler(
        request: Request,
        exc: Exception,
    ):
        logger.exception(
            "Unexpected server error on %s %s",
            request.method,
            request.url.path,
        )

        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "internal_server_error",
                    "message": "An unexpected error occurred.",
                }
            },
        )
