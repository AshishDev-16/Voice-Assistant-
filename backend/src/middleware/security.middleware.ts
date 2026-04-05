import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import { Router } from 'express';

/**
 * Configure standard security middleware for the Express application.
 * @param app Express Application or Router
 */
export const applySecurityMiddleware = (app: any) => {
  // 1. Set security HTTP headers
  app.use(helmet());

  // 2. Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // 3. Prevent HTTP parameter pollution
  app.use(hpp());

  // 4. Configure CORS with restricted origins
  const allowedOrigins = [
    'http://localhost:3000', // Local frontend
    process.env.FRONTEND_URL, // Production frontend (if defined)
  ].filter(Boolean) as string[];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  }));
};
