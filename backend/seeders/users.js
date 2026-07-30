import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import users from './data/users.js';
import User from '../src/modules/users/model.js';
import connectDB from '../src/config/db.js';
import logger from '../src/utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const importUsers = async () => {
  try {
    await User.deleteMany();
    const createdUsers = await User.insertMany(users);
    logger.info(`${createdUsers.length} users imported`);
    process.exit();
  } catch (error) {
    logger.fatal({ err: error }, 'User import failed');
    process.exit(1);
  }
};

const destroyUsers = async () => {
  try {
    await User.deleteMany();
    logger.info('All users destroyed');
    process.exit();
  } catch (error) {
    logger.fatal({ err: error }, 'User destruction failed');
    process.exit(1);
  }
};

export { importUsers, destroyUsers };

if (import.meta.url === `file://${process.argv[1]}`) {
  connectDB();
  if (process.argv[2] === '-d') {
    destroyUsers();
  } else {
    importUsers();
  }
}
