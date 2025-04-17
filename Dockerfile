# Use an official Node runtime as the base image
FROM node:20-alpine AS base

# Set working directory in the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Make docker-entrypoint.js executable
RUN chmod +x docker-entrypoint.js

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Environment variable for port
ENV PORT=3000
ENV NODE_ENV=production

# Start the application using the entry point script
CMD ["./docker-entrypoint.js", "npm", "start"]
