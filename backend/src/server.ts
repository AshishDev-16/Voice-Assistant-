import 'dotenv/config';
import express from 'express';
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

import rateLimit from 'express-rate-limit';
import { applySecurityMiddleware } from './middleware/security.middleware';
import { clerkMiddleware } from './middleware/auth.middleware';

// Load environment variables
// Configured via top-level import

const app = express();
const port = process.env.PORT || 3000;

// Security & Authentication Middleware
applySecurityMiddleware(app); // Helmet, HPP, NoSQL Sanitize, CORS
app.use(clerkMiddleware({
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
})); // Base Clerk logic for all routes

// Global Rate Limiter: Prevent brute-force/DoS
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
});
app.use('/api/', globalLimiter);

app.use(express.json());

// Routes
app.use('/api/webhooks/whatsapp', webhookRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/calls', callRoutes);

// Database connection & Server start
const startServer = async () => {
  try {
   // Environment validation
const geminiKey = process.env.GEMINI_API_KEY;
if (geminiKey) {
  const masked = `${geminiKey.substring(0, 6)}...${geminiKey.substring(geminiKey.length - 4)}`;
  logger.info(`GEMINI_API_KEY loaded: ${masked} (Length: ${geminiKey.length})`);
} else {
  logger.warn('GEMINI_API_KEY is missing in environment variables');
}

// Connect to MongoDB
connectDB();
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
