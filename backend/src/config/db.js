import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from environment variables');
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.fatal({ err: error }, 'MongoDB connection failed');
    process.exit(1);
  }
};

export default connectDB;
