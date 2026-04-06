"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkMiddleware = exports.requireAuth = void 0;
const express_1 = require("@clerk/express");
Object.defineProperty(exports, "clerkMiddleware", { enumerable: true, get: function () { return express_1.clerkMiddleware; } });
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Middleware to require authentication for specific routes.
 * Uses getAuth() to check for a valid session.
 */
const requireAuth = (req, res, next) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId) {
            logger_1.default.warn(`Unauthorized access attempt to ${req.originalUrl} from ${req.ip}`);
            return res.status(401).json({ error: 'Authentication required' });
        }
        next();
    }
    catch (error) {
        logger_1.default.error('Authentication check failed:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.requireAuth = requireAuth;
