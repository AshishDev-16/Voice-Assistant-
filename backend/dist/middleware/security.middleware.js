"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySecurityMiddleware = void 0;
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
/**
 * Configure standard security middleware for the Express application.
 * @param app Express Application or Router
 */
const applySecurityMiddleware = (app) => {
    // 1. Set security HTTP headers
    app.use((0, helmet_1.default)());
    // 2. Data sanitization against NoSQL query injection
    app.use((0, express_mongo_sanitize_1.default)());
    // 3. Prevent HTTP parameter pollution
    app.use((0, hpp_1.default)());
    // 4. Configure CORS with restricted origins
    const allowedOrigins = [
        'http://localhost:3000', // Local frontend
        process.env.FRONTEND_URL, // Production frontend (if defined)
    ].filter(Boolean);
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
    }));
};
exports.applySecurityMiddleware = applySecurityMiddleware;
