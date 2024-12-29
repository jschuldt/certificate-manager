import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/environment';
import { errorHandler } from './middlewares/error.middleware';
import apiRoutes from './routes';
import swaggerOptions from './config/swagger';
import { connectDB } from './config/database';

const app = express();

// Middleware
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false, // Temporarily disable CSP for troubleshooting
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
  })
);

// Add headers specifically for Swagger UI in Safari
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

app.use(morgan('dev'));
app.use(express.json());

// Initialize Swagger with specific options for Safari
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "Certificate Manager API Documentation",
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      displayRequestDuration: true,
      persistAuthorization: true,
      tryItOutEnabled: true,
      filter: true,
      withCredentials: true
    }
  })
);

// Routes
app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3443;

const startServer = async () => {
  try {
    // Connect to MongoDB first
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
    process.exit(1);
  }
};

startServer();
