import { clerkMiddleware } from '@clerk/express';
import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.use(clerkMiddleware());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Success' });
});

export default app;
