# Certificate Manager

A modern certificate management system built with the MERN stack (MongoDB, Express.js, React, Node.js) and TypeScript.

## Project Structure

```
certificate-manager/
├── client/                 # React frontend
├── server/                # Express + TypeScript backend
├── database/             # MongoDB related files
└── docker/              # Docker compose and configuration
```

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn

## Getting Started

1. Clone the repository
2. Run the development environment:
   ```bash
   docker-compose up
   ```
3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3443

## Development

### Client

```bash
cd client
npm install
npm start
```

### Server

```bash
cd server
npm install
npm run dev
```

## Building for Production

```bash
docker-compose -f docker-compose.prod.yml up --build
```
