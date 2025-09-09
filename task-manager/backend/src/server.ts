import { createServer } from 'http';
import { Server } from 'socket.io';
import { createApp } from './app';
import { config } from './config/config';
import { setupTaskSocket } from './sockets/taskSocket';
import { logger } from './utils/logger';

const app = createApp();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.allowedOrigins,
    credentials: true,
  },
});

setupTaskSocket(io);

httpServer.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});