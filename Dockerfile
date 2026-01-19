# Stage 1: Build the frontend
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the backend
FROM node:18-alpine
WORKDIR /app/backend

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy the rest of the backend code
COPY backend/ ./

# Copy the .env file (if it exists, for local dev)
COPY backend/.env ./.env

# Copy the built frontend from the first stage (adjusting path relative to WORKDIR)
COPY --from=build-frontend /app/frontend/build ../frontend/build

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "index.js"]