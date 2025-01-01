import mongoose from 'mongoose';
import { config } from './environment.config';

/**
 * Establishes connection to MongoDB using the configured URI
 * Exits process with code 1 if connection fails
 */
export const connectDB = async (): Promise<void> => {
  try {
    // Attempt to connect to MongoDB using the URI from environment config
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    // Log error and exit if connection fails
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
