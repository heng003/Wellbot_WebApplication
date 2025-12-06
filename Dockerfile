# Stage 1: Build the frontend
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the backend
FROM node:18-alpine
WORKDIR /app
# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
RUN npm install --prefix backend --production

# Copy the rest of the backend code
COPY backend/ ./backend

# Copy the built frontend from the first stage
COPY --from=build-frontend /app/frontend/build ./frontend/build

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "backend/index.js"]