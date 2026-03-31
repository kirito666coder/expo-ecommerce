import http from 'http';
import app from './app';
import { ConnectDB } from './configs/db';
import logger from './libs/logger';

const PORT = Number(process.env.PORT) || 5000;

let server: http.Server;

const startServer = async () => {
  try {
    await ConnectDB();

    server = http.createServer(app);

    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Startup failed:', error);
    process.exit(1);
  }
};

startServer();
