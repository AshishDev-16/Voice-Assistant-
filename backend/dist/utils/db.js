"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose_1.default.connect(mongoUri);
        logger_1.default.info('Connected to MongoDB successfully');
    }
    catch (error) {
        logger_1.default.error('MongoDB connection error:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
