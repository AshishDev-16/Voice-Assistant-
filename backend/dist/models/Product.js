"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    stock: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
    createdAt: { type: Date, default: Date.now }
});
exports.Product = mongoose_1.default.model('Product', productSchema);
