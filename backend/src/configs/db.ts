import { connect } from 'mongoose';
import { ENV } from './env';

export const ConnectDB = async (): Promise<void> => {
  const DB_URL = ENV.DB_URL;
  if (!DB_URL) {
    process.exit(1);
  }
  try {
    const db = await connect(DB_URL as string);
    console.log(`Connect to ${db.connection.name}`);
  } catch (error) {
    console.log('Error to connect MongoDB', error);
    process.exit(1);
  }
};
