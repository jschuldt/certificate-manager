import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration object
 * Provides centralized access to environment variables with defaults
 */
export const config = {
  // Server port (defaults to 3443 if PORT env var is not set)
  port: process.env.PORT || 3443,
  
  // Node environment (development/production/test)
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB connection string
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/certificate-manager',
  
  // JWT secret for authentication
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
};
