import http from 'http';
import app from './app';
import { ConnectDB } from './configs/db';
import logger from './libs/logger';

const rawPort = process.env.PORT;

const parsedPort = rawPort === undefined ? NaN : Number(rawPort);

const PORT =
  Number.isInteger(parsedPort) && parsedPort >= 0 && parsedPort <= 65535 ? parsedPort : 5000;

const HOST = '0.0.0.0';

let server: http.Server;

const startServer = async () => {
  try {
    await ConnectDB();

    server = http.createServer(app);

    server.listen(PORT, HOST, () => {
      logger.info(`Server listening on ${HOST}:${PORT} (http://localhost:${PORT})`);
    });
  } catch (error) {
    logger.error('Startup failed:', error);
    process.exit(1);
  }
};

startServer();
