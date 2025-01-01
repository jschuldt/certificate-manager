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

## Server Architecture

The server follows a clean architecture pattern based on MVC (Model-View-Controller) with additional service layer for better separation of concerns.

### Directory Structure

```
server/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Request handlers and response formatting
│   ├── docs/         # Swagger/OpenAPI documentation files
│   ├── middleware/   # Custom Express middleware
│   ├── models/       # MongoDB schema definitions and models
│   ├── routes/       # API route definitions
│   ├── services/     # Business logic implementation
│   ├── tests/        # Test files
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Helper functions and utilities
```

### Architectural Components

#### Models
- Located in `src/models/`
- Define MongoDB schemas and models
- Handle data structure and validation
- Implement database-level methods

#### Controllers
- Located in `src/controllers/`
- Handle HTTP requests and responses
- Validate input data
- Delegate business logic to services
- Format API responses

#### Services
- Located in `src/services/`
- Implement core business logic
- Handle complex operations
- Maintain separation from database and HTTP layers
- Manage interactions between different models

#### Routes
- Located in `src/routes/`
- Define API endpoints
- Map routes to controller methods
- Handle route-specific middleware
- Group related endpoints

### Testing Architecture

The project uses Jest as the testing framework with the following organization:
  - Define common test scenarios

### API Documentation

Located in `src/docs/`, the API documentation uses Swagger/OpenAPI specification:

- Automatically generated API documentation
- Interactive API testing interface
- Request/response examples
- Authentication documentation
- Schema definitions

Access the Swagger UI at: http://localhost:3443/api-docs

### Request Flow

1. Client makes HTTP request
2. Route handles the request and passes to middleware
3. Controller receives the request
4. Controller validates input and calls appropriate service
5. Service executes business logic using models
6. Response flows back through controller
7. Controller formats and sends response

This architecture ensures:
- Separation of concerns
- Maintainable and testable code
- Scalable application structure
- Clear responsibility boundaries
- Easy to implement new features
