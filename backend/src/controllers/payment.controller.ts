import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';

dotenv.config(); // Ensure env vars are loaded before Razorpay reads them

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  });
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { planId, clerkUserId } = req.body;

    if (!planId || !clerkUserId) {
      return res.status(400).json({ error: 'planId and clerkUserId are required' });
    }

    let amount = 0;
    if (planId === 'starter') amount = 999 * 100; // paise
    else if (planId === 'pro') amount = 2999 * 100;
    else return res.status(400).json({ error: 'Invalid planId' });

    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${clerkUserId.slice(0, 8)}`,
      notes: { planId, clerkUserId },
    };

    const order = await getRazorpay().orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error('[RAZORPAY_CREATE_ORDER]', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      clerkUserId,
    } = req.body;

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
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
  } catch (error) {
    console.error('[RAZORPAY_VERIFY_PAYMENT]', error);
    return res.status(500).json({ error: 'Payment verification failed' });
  }
};
