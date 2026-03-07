import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook.routes';
import { connectDB } from './utils/db';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/webhooks', webhookRoutes);

// Database connection & Server start
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start the server', error);
    process.exit(1);
  }
};

startServer();
