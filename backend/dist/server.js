"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const webhook_routes_1 = __importDefault(require("./routes/webhook.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const voice_routes_1 = __importDefault(require("./routes/voice.routes"));
const call_routes_1 = __importDefault(require("./routes/call.routes"));
const logger_1 = __importDefault(require("./utils/logger"));
const db_1 = require("./utils/db");
const voice_service_1 = require("./services/voice.service");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const security_middleware_1 = require("./middleware/security.middleware");
const auth_middleware_1 = require("./middleware/auth.middleware");
// Load environment variables
// Configured via top-level import
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Security & Authentication Middleware
(0, security_middleware_1.applySecurityMiddleware)(app); // Helmet, HPP, NoSQL Sanitize, CORS
app.use((0, auth_middleware_1.clerkMiddleware)({
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
})); // Base Clerk logic for all routes
// Global Rate Limiter: Prevent brute-force/DoS
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
});
app.use('/api/', globalLimiter);
app.use(express_1.default.json());
// Routes
app.use('/api/webhooks/whatsapp', webhook_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/payment', payment_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/voice', voice_routes_1.default);
app.use('/api/calls', call_routes_1.default);
// Database connection & Server start
const startServer = async () => {
    try {
        // Environment validation
        const geminiKey = process.env.GEMINI_API_KEY;
        if (geminiKey) {
            const masked = `${geminiKey.substring(0, 6)}...${geminiKey.substring(geminiKey.length - 4)}`;
            logger_1.default.info(`GEMINI_API_KEY loaded: ${masked} (Length: ${geminiKey.length})`);
        }
        else {
            logger_1.default.warn('GEMINI_API_KEY is missing in environment variables');
        }
        // Connect to MongoDB
        (0, db_1.connectDB)();
        const server = app.listen(port, () => {
            logger_1.default.info(`Server is running on port ${port}`);
        });
        // Attach Twilio WebSocket Media Server
        (0, voice_service_1.initializeWebSocket)(server);
    }
    catch (error) {
        logger_1.default.error('Failed to start the server', error);
        process.exit(1);
    }
};
startServer();
