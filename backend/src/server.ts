import http from 'http';
import app from './app';
import { ConnectDB } from './configs/db';

const PORT = process.env.PORT || 5000;

let server: http.Server;

const startServer = async () => {
  try {
    await ConnectDB();

    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
};

startServer();
