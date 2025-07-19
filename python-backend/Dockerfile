# syntax=docker/dockerfile:1
FROM python:3.12-slim

# Metadata
LABEL org.opencontainers.image.title="Python Backend API" \
      org.opencontainers.image.description="FastAPI backend service" \
      org.opencontainers.image.authors="your-email@company.com" \
      org.opencontainers.image.version="1.0.0"

WORKDIR /app

# Security: Create non-root user CORRECTLY
RUN groupadd --system --gid 1001 python && \
    useradd --system --uid 1001 --gid python --no-log-init python

# Install system dependencies in ONE layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements FIRST for cache
COPY requirements.txt .

# Install Python dependencies
RUN set -o pipefail && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY --chown=python:python . .

# Switch to non-root user
USER python

# Environment variables
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
