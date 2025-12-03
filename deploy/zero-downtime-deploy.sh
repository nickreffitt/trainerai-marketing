#!/bin/bash

set -e

# Default to trainerai-demo if APP_NAME not set
APP_NAME="${APP_NAME:-trainerai-demo}"
OLD_CONTAINER="${APP_NAME}"
NEW_CONTAINER="${APP_NAME}-new"

echo "Starting deployment for ${APP_NAME}..."

# Check if old container exists
if docker ps -a --format '{{.Names}}' | grep -q "^${OLD_CONTAINER}$"; then
  echo "Existing container found - performing zero-downtime deployment..."
  EXISTING_CONTAINER=true
else
  echo "No existing container - performing first-time deployment..."
  EXISTING_CONTAINER=false
fi

# Stop and remove any leftover new container
echo "Cleaning up any existing new container..."
docker stop "${NEW_CONTAINER}" 2>/dev/null || true
docker rm "${NEW_CONTAINER}" 2>/dev/null || true

# Determine which port to use for health check
if [ "$EXISTING_CONTAINER" = true ]; then
  # Old container is on 3001, use 3002 for new container
  TEMP_PORT=3002
else
  # No old container, use 3001 directly
  TEMP_PORT=3001
fi

# Start new container
echo "Starting new container on port ${TEMP_PORT}..."
docker run -d \
  --name "${NEW_CONTAINER}" \
  -p ${TEMP_PORT}:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e HOSTNAME=0.0.0.0 \
  --restart unless-stopped \
  ${APP_NAME}:latest

# Wait for new container to be healthy (check if it's running and responding)
echo "Waiting for new container to be healthy on port ${TEMP_PORT}..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker ps --filter "name=${NEW_CONTAINER}" --filter "status=running" | grep -q "${NEW_CONTAINER}"; then
        # Container is running, check if it responds
        if curl -f http://localhost:${TEMP_PORT} > /dev/null 2>&1; then
            echo "New container is healthy!"
            break
        fi
    fi
    attempt=$((attempt + 1))
    echo "Attempt $attempt/$max_attempts - waiting for container to be healthy..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "New container failed to become healthy. Rolling back..."
    echo "Container logs:"
    docker logs "${NEW_CONTAINER}" 2>&1 | tail -50
    docker stop "${NEW_CONTAINER}" || true
    docker rm "${NEW_CONTAINER}" || true
    exit 1
fi

# Handle container swapping based on whether we had an existing container
if [ "$EXISTING_CONTAINER" = true ]; then
  echo "Swapping containers..."

  # Stop old container (frees up port 3001)
  echo "Stopping old container..."
  docker stop "${OLD_CONTAINER}" 2>/dev/null || true
  docker rm "${OLD_CONTAINER}" 2>/dev/null || true

  # Stop new container temporarily
  echo "Stopping new container to rebind to port 3001..."
  docker stop "${NEW_CONTAINER}"
  docker rm "${NEW_CONTAINER}"

  # Start container again with correct port and name
  echo "Starting container on port 3001..."
  docker run -d \
    --name "${OLD_CONTAINER}" \
    -p 3001:3001 \
    -e NODE_ENV=production \
    -e PORT=3001 \
    -e HOSTNAME=0.0.0.0 \
    --restart unless-stopped \
    ${APP_NAME}:latest
else
  echo "Renaming new container to production name..."
  # First time deployment - stop and recreate with correct name
  docker stop "${NEW_CONTAINER}"
  docker rm "${NEW_CONTAINER}"
  docker run -d \
    --name "${OLD_CONTAINER}" \
    -p 3001:3001 \
    -e NODE_ENV=production \
    -e PORT=3001 \
    -e HOSTNAME=0.0.0.0 \
    --restart unless-stopped \
    ${APP_NAME}:latest
fi

echo "Deployment completed successfully!"
