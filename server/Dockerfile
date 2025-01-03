FROM node:22.11-alpine

WORKDIR /app

# Install necessary build tools
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package*.json ./

# Copy source code
COPY . .

EXPOSE 3443

# Container will start with npm install followed by npm start
CMD ["sh", "-c", "npm install && npm start"]