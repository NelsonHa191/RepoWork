#!/bin/bash
# Deployment script for Digital Ocean

# Stop on any error
set -e

echo "Starting deployment process..."

# Make sure all environment variables are set
if [ -z "$DATABASE_URL" ] || [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ] || [ -z "$NEXT_PUBLIC_APP_URL" ]; then
  echo "Error: Missing required environment variables!"
  echo "Please make sure the following are set:"
  echo "- DATABASE_URL"
  echo "- GOOGLE_CLIENT_ID"
  echo "- GOOGLE_CLIENT_SECRET"
  echo "- NEXT_PUBLIC_APP_URL"
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Modify auth route to ensure compatibility
echo "Setting up auth routes..."
mkdir -p app/\(auth\)/api/auth/\[...all\]
cat > app/\(auth\)/api/auth/\[...all\]/route.ts << EOL
// app/(auth)/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Define proper response handlers for all HTTP methods
const handler = toNextJsHandler(auth.handler);

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
export const PATCH = handler.PATCH;
export const HEAD = handler.HEAD;
export const OPTIONS = handler.OPTIONS;
EOL

# Build the application
echo "Building the application..."
SKIP_ENV_VALIDATION=true npm run build

# If we're using Docker
if [ "$USE_DOCKER" = "true" ]; then
  echo "Building Docker image..."
  docker build -t my-nextjs-app .
  
  echo "Stopping any existing container..."
  docker stop my-nextjs-app-container || true
  docker rm my-nextjs-app-container || true
  
  echo "Starting new container..."
  docker run -d --name my-nextjs-app-container \
    -p 3000:3000 \
    -e DATABASE_URL="$DATABASE_URL" \
    -e GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
    -e GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
    -e NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL" \
    my-nextjs-app
else
  # Direct deployment
  echo "Starting the application..."
  npm start
fi

echo "Deployment completed successfully!"