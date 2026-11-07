
# DebugArena API Design

## 1. General Conventions

- API Prefix: /api/v1
- Data Format: JSON
- Naming Convention: snake_case
- Authentication: Bearer Token
- Validation: Pydantic

## 2. Authentication APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/v1/auth/register | Register user |
| POST | /api/v1/auth/login | Login |
| GET | /api/v1/auth/me | Current user |

Owner: Vishu

## 3. Assessment APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/v1/assessments | Create assessment |
| GET | /api/v1/assessments | List assessments |
| GET | /api/v1/assessments/{id} | Get assessment |
| PATCH | /api/v1/assessments/{id} | Update assessment |
| DELETE | /api/v1/assessments/{id} | Delete draft |
| POST | /api/v1/assessments/{id}/publish | Publish assessment |

Owner: Abhay

## 4. Challenge APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/v1/challenges | Create challenge |
| GET | /api/v1/challenges/{id} | Get challenge |
| PATCH | /api/v1/challenges/{id} | Update challenge |

Owner: Abhay

## 5. Health APIs

| Method | Endpoint |
|--------|----------|
| GET | /api/v1/health |
| GET | /api/v1/health/database |

Owner: Aditya

## 6. Response Conventions

Successful requests return JSON.

Errors follow the central error structure
implemented in backend/app/core/exception_handlers.py.

## 7. Important Rules

- All endpoints must use the /api/v1 prefix.
- All request and response fields use snake_case.
- Protected endpoints must enforce authorization.
- Hidden test cases must never be exposed to candidates.
- API changes must be communicated to frontend developers.
