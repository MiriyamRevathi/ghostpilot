# Multi-stage Dockerfile for GhostPilot Platform
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

FROM python:3.11-slim AS backend
WORKDIR /app/backend
COPY backend/pyproject.toml backend/poetry.lock* ./
RUN pip install --no-cache-dir poetry && poetry config virtualenvs.create false && poetry install --no-root --no-interaction
COPY backend /app/backend
COPY --from=frontend-builder /app/dist /app/dist

ENV PORT=8000
EXPOSE 8000
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
