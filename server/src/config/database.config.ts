import mongoose from 'mongoose';
import { config } from './environment.config';

/**
 * Establishes connection to MongoDB using the configured URI
 * Exits process with code 1 if connection fails
 */
export const connectDB = async (): Promise<void> => {
  try {
    // Use mongodb.uri instead of mongoUri
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    // Log error and exit if connection fails
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
