# MediSearch API Reference

## Base URL

Local development uses:

~~~text
http://localhost:5000/api
~~~

The frontend uses the Vite /api proxy locally when VITE_API_URL is empty.

## Health

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| GET | /health | No | Returns liveness status, environment, uptime, and timestamp. |

## Authentication

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | /auth/register | No | Creates a user and starts an HttpOnly cookie session. |
| POST | /auth/login | No | Authenticates a user and starts an HttpOnly cookie session. |
| POST | /auth/logout | No | Clears the session cookie. |
| GET | /auth/me | Yes | Returns the current authenticated user. |
| PATCH | /auth/update-profile | Yes | Updates name and preferred language. |
| PATCH | /auth/change-password | Yes | Changes the authenticated user password. |

Authentication uses a cookie named jwt. Client requests must include credentials when the frontend and backend are hosted on different origins.

## Medicine

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| GET | /medicine/search?name=paracetamol&lang=en | Optional | Returns a medicine information response. Guest results are supported. |
| GET | /medicine/compare?a=paracetamol&b=ibuprofen&lang=en | Optional | Returns two medicine responses for comparison. |

Logged-in users have medicine search and comparison requests recorded in their history.

## OCR

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | /ocr/extract | Optional | Accepts an image multipart field named image and extracts medicine or prescription fields. |

The current upload limit is 5 MB and image MIME types are required.

## History

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| GET | /history | Yes | Returns paginated authenticated-user history. |
| GET | /history/stats | Yes | Returns history counts, average response times, and top searches. |
| DELETE | /history | Yes | Clears the authenticated user history. |
| DELETE | /history/:id | Yes | Deletes one authenticated user history item. |

## Validation and errors

Invalid input returns a client error with a status and message. Common validation responses use HTTP 422. Unauthorized requests use HTTP 401. Missing routes return HTTP 404. Provider or parsing failures are handled by the centralized error middleware.

Example request:

~~~bash
curl "http://localhost:5000/api/medicine/search?name=paracetamol&lang=en"
~~~
