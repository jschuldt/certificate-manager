import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3443,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/certificate-manager',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
};
