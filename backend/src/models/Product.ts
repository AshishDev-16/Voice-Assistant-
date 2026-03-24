import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  stock: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export const Product = mongoose.model('Product', productSchema);
