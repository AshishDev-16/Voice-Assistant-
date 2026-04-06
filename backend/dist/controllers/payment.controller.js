"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const backend_1 = require("@clerk/backend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Ensure env vars are loaded before Razorpay reads them
const clerk = (0, backend_1.createClerkClient)({ secretKey: process.env.CLERK_SECRET_KEY });
function getRazorpay() {
    return new razorpay_1.default({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}
const createOrder = async (req, res) => {
    try {
        const { planId, clerkUserId } = req.body;
        if (!planId || !clerkUserId) {
            return res.status(400).json({ error: 'planId and clerkUserId are required' });
        }
        let amount = 0;
        if (planId === 'starter')
            amount = 999 * 100; // paise
        else if (planId === 'pro')
            amount = 2999 * 100;
        else
            return res.status(400).json({ error: 'Invalid planId' });
        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}_${clerkUserId.slice(0, 8)}`,
            notes: { planId, clerkUserId },
        };
        const order = await getRazorpay().orders.create(options);
        return res.status(200).json(order);
    }
    catch (error) {
        console.error('[RAZORPAY_CREATE_ORDER]', error);
        return res.status(500).json({ error: 'Failed to create order' });
    }
};
exports.createOrder = createOrder;
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, clerkUserId, } = req.body;
        const text = `${razorpay_order_id}|${razorpay_payment_id}`;
        const generated_signature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');
        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ error: 'Invalid signature' });
        }
        // Update Clerk user metadata
        await clerk.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
                plan: planId,
                razorpayPaymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
            },
        });
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('[RAZORPAY_VERIFY_PAYMENT]', error);
        return res.status(500).json({ error: 'Payment verification failed' });
    }
};
exports.verifyPayment = verifyPayment;
