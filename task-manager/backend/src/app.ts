import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

export const createApp = () => {
  const app = express();
  
  app.use(cors({
    origin: config.allowedOrigins,
    credentials: true,
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });
  
  app.get('/health', (_req, res) => {
    res.json({ status: 'OK' });
  });
  
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  
  app.use(errorHandler);
  
  return app;
};