import mongoose from 'mongoose';
import { ENV } from './env';

export const ConnectDB = async (): Promise<void> => {
  const DB_URL = ENV.DB_URL;
  if (!DB_URL) {
    throw new Error('DB_URL is not configured');
  }

  try {
    const db = await mongoose.connect(DB_URL);
    console.log(`Connected to MongoDB: ${db.connection.name}`);
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw error;
  }
};
