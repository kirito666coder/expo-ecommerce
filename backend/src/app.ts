import express, { Request, Response } from 'express';
import AllRoutes from './routes';

const app = express();

app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Success' });
});

app.use('/api', AllRoutes);

export default app;
