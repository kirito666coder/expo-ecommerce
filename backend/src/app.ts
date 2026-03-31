import express, { ErrorRequestHandler, Request, Response, Express } from 'express';
import AllRoutes from './routes';
import morganMiddleware from './libs/morgan';
import cors from 'cors';
import helmet from 'helmet';
// import { ENV } from './configs/env';
import logger from './libs/logger';

const app: Express = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(morganMiddleware);

app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Success' });
});

app.use('/api', AllRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error(err);

  res.status((err as any).status || 500).json({
    message: err.message || 'Internal server error',
  });
};

app.use(errorHandler);

export default app;
