# Recipe Backend

FastAPI backend for managing recipes and detecting ingredients from food images using Google Gemini.

## Features

- CRUD API for recipes and their ingredients
- PostgreSQL database with SQLAlchemy models and Alembic migrations
- Ingredient detection from uploaded images via Google Gemini Vision
- Docker Compose setup for local development
- Interactive API docs at `/docs`

## Tech Stack

- **FastAPI** — REST API
- **SQLAlchemy** — ORM
- **Alembic** — database migrations
- **PostgreSQL** — database
- **Google Gemini** — image-based ingredient detection
- **uv** — dependency and environment management

## Project Structure

```
app/
├── api/           # Route handlers
├── core/          # Config, database, dependencies
├── models/        # SQLAlchemy models
├── schemas/       # Pydantic request/response models
└── services/      # Business logic
alembic/           # Migration scripts
tests/             # Pytest tests
```

## Prerequisites

- Python 3.13+
- [uv](https://docs.astral.sh/uv/)
- Docker and Docker Compose (optional, recommended)
- Google Gemini API key ([get one here](https://aistudio.google.com/apikey))

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/recipes
GOOGLE_API_KEY=your_gemini_api_key_here
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string. Use `localhost` for local dev, `db` is set automatically in Docker. |
| `GOOGLE_API_KEY` | Required for `/ingredients/detect`. Get it from [Google AI Studio](https://aistudio.google.com/apikey). |
| `GEMINI_MODEL` | Optional. Defaults to `gemini-2.5-flash`. |

## Quick Start with Docker

```bash
# 1. Add your API key to .env
cp .env.example .env   # or create .env manually

# 2. Start Postgres and the API
docker compose up -d

# 3. Run migrations
docker compose exec web uv run alembic upgrade head
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

## Local Development (without Docker for the API)

```bash
# Start only the database
docker compose up -d db

# Install dependencies
uv sync

# Run migrations
uv run alembic upgrade head

# Start the API
uv run uvicorn app.main:app --reload
```

> **Note:** Do not run `uv sync` inside Docker and on the host at the same time without the `/app/.venv` volume mount — Docker would overwrite your local virtual environment. The current `docker-compose.yml` already isolates the container venv.

## Database Migrations

Alembic is used instead of Django-style migrations:

| Task | Command |
|------|---------|
| Create migration (after changing models) | `uv run alembic revision --autogenerate -m "message"` |
| Apply migrations | `uv run alembic upgrade head` |
| Check current version | `uv run alembic current` |
| Roll back one step | `uv run alembic downgrade -1` |

With Docker:

```bash
docker compose exec web uv run alembic revision --autogenerate -m "message"
docker compose exec web uv run alembic upgrade head
```

## API Endpoints

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |

### Recipes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/recipes` | List all recipes |
| `GET` | `/recipes/{id}` | Get a recipe |
| `POST` | `/recipes` | Create a recipe |
| `PATCH` | `/recipes/{id}` | Update a recipe |
| `DELETE` | `/recipes/{id}` | Delete a recipe |

**Create recipe example:**

```bash
curl -X POST http://localhost:8000/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pancakes",
    "description": "Fluffy breakfast pancakes",
    "instructions": "Mix ingredients, cook on a griddle, serve warm.",
    "prep_time_minutes": 10,
    "cook_time_minutes": 15,
    "servings": 4,
    "ingredients": [
      {"name": "flour", "quantity": "2", "unit": "cups"},
      {"name": "milk", "quantity": "1", "unit": "cup"}
    ]
  }'
```

### Ingredient Detection

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/ingredients/detect` | Detect ingredients from an uploaded image |

Upload a JPEG, PNG, or WebP image (max 20 MB):

```bash
curl -X POST http://localhost:8000/ingredients/detect \
  -F "image=@/path/to/your/image.jpg"
```

**Example response:**

```json
{
  "ingredients": [
    {"name": "tomato", "confidence": 0.95},
    {"name": "onion", "confidence": 0.88}
  ],
  "notes": "Fresh vegetables on a cutting board"
}
```

## Testing

```bash
uv run pytest -v
```

## Troubleshooting

### `Google API key is not configured` (503)

Add your key to `.env` and restart:

```bash
# .env
GOOGLE_API_KEY=your_key_here

docker compose up -d --force-recreate web
```

### Alembic: `Target database is not up to date`

Apply pending migrations first:

```bash
uv run alembic upgrade head
```

### Broken local `.venv` after using Docker

Remove and recreate the virtual environment on the host:

```bash
docker compose stop web
docker compose run --rm --entrypoint "" web rm -rf /app/.venv
uv sync
```


test