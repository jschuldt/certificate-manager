import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Check if running in Docker container
const isDocker = process.env.DOCKER === 'true';

/**
 * Application configuration object
 * Provides centralized access to environment variables with defaults
 */
export const config = {
  // Server port (defaults to 3443 if PORT env var is not set)
  port: process.env.PORT || 3443,
  
  // Node environment (development/production/test)
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT secret for authentication
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  
  // MongoDB connection configuration
  mongodb: {
    // Use container name in Docker, localhost otherwise
    uri: process.env.MONGODB_URI || (isDocker 
      ? 'mongodb://mongodb:27017/certificate-manager'
      : 'mongodb://localhost:27017/certificate-manager')
  }
};
