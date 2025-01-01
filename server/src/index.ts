/**
 * Main application entry point.
 * Sets up Express server with middleware, routes, and Swagger documentation.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/environment.config';
import { errorHandler } from './middlewares/error.middleware';
import apiRoutes from './routes/index.routes';
import swaggerOptions from './config/swagger.config';
import { connectDB } from './config/database.config';

const app = express();

// === Security and Development Middleware ===
/**
 * Configure CORS to handle cross-origin requests
 * and Helmet for security headers
 */
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for Swagger UI compatibility
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
  })
);

/**
 * Safari-specific headers to ensure proper functionality
 * of Swagger UI and cross-origin resources
 */
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

app.use(morgan('dev'));
app.use(express.json());

// === API Documentation Setup ===
/**
 * Configure and initialize Swagger UI with custom settings
 * for API documentation and testing interface
 */
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true, // Enable search functionality
    customSiteTitle: "Certificate Manager API Documentation",
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      displayRequestDuration: true, // Show API response times
      persistAuthorization: true,   // Maintain auth between page refreshes
      tryItOutEnabled: true,        // Enable API testing feature
      filter: true,                 // Enable endpoint filtering
      withCredentials: true         // Allow sending cookies with requests
    }
  })
);

// === Route Configuration ===
/**
 * Mount the main API routes under /api endpoint
 * Error handling middleware catches any errors thrown in routes
 */
app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler);

// === Server Initialization ===
const PORT = process.env.PORT || 3443;

/**
 * Starts the server after establishing database connection
 * Implements a graceful startup pattern
 */
const startServer = async () => {
  try {
    // Ensure database connection before starting server
    await connectDB();

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Server is up and running!`);
      console.log(`📡 Server URL: http://localhost:${PORT}`);
      console.log(`🛣️  API endpoint: http://localhost:${PORT}/api`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit with error code if server fails to start
  }
};

startServer();
