import http from 'http';
import app from './app';
import { ConnectDB } from './configs/db';

const PORT = process.env.PORT || 5000;
const StartServer = async () => {
  await ConnectDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
};

StartServer();
