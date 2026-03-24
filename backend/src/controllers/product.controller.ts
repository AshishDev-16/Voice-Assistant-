import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { clerkId } = req.query;
    if (!clerkId) return res.status(400).json({ error: 'clerkId is required' });

    const products = await Product.find({ clerkId }).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { clerkId, name, price, stock } = req.body;
    if (!clerkId || !name || !price || !stock) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProduct = await Product.create({
      clerkId,
      name,
      price,
      stock,
      status: 'Active'
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('[PRODUCTS_CREATE]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { clerkId } = req.query;
    
    if (!clerkId || !id) return res.status(400).json({ error: 'clerkId and productId required' });

    await Product.findOneAndDelete({ _id: id, clerkId });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[PRODUCTS_DELETE]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
