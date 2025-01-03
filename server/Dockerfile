# Build stage
FROM node:16 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies, including dev dependencies
RUN npm install

# Copy source
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:16-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies and rebuild bcrypt
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    npm install --only=production && \
    npm rebuild bcrypt --build-from-source && \
    apt-get remove -y python3 make g++ && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3443

CMD ["node", "dist/index.js"]