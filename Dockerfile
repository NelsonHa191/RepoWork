# Use an official Node runtime as the base image
FROM node:20-alpine AS base

# Set working directory in the container
WORKDIR /app

# Install dependencies
# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json* ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]