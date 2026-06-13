FROM python:3.13-slim

WORKDIR /app

# install uv
RUN pip install uv

# copy project files
COPY pyproject.toml uv.lock ./

# install dependencies
RUN uv sync

COPY . .

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]