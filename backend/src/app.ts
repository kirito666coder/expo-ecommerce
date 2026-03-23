import express, { ErrorRequestHandler, Request, Response } from 'express';
import AllRoutes from './routes';
import morganMiddleware from './libs/morgan';

const app = express();

app.use(express.json());

app.use(morganMiddleware);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Success' });
});

app.use('/api', AllRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(err);

  res.status((err as any).status || 500).json({
    message: err.message || 'Internal server error',
  });
};

app.use(errorHandler);

export default app;
