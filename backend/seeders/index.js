import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../src/config/db.js';
import logger from '../src/utils/logger.js';
import { importUsers, destroyUsers } from './users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

connectDB();

const importData = async () => {
  try {
    await importUsers();
    logger.info('All data imported');
    process.exit();
  } catch (error) {
    logger.fatal({ err: error }, 'Data import failed');
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await destroyUsers();
    logger.info('All data destroyed');
    process.exit();
  } catch (error) {
    logger.fatal({ err: error }, 'Data destruction failed');
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
