import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import webhookRoutes from './routes/webhook.routes';
import dashboardRoutes from './routes/dashboard.routes';
import userRoutes from './routes/user.routes';
import paymentRoutes from './routes/payment.routes';
import profileRoutes from './routes/profile.routes';
import productRoutes from './routes/product.routes';
import voiceRoutes from './routes/voice.routes';
import callRoutes from './routes/call.routes';
import logger from './utils/logger';
import { connectDB } from './utils/db';
import { initializeWebSocket } from './services/voice.service';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/webhooks/whatsapp', webhookRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/calls', callRoutes);

// Database connection & Server start
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
    
    // Attach Twilio WebSocket Media Server
    initializeWebSocket(server);
  } catch (error) {
    logger.error('Failed to start the server', error);
    process.exit(1);
  }
};

startServer();
