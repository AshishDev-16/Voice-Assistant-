"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.createProduct = exports.getProducts = void 0;
const Product_1 = require("../models/Product");
const getProducts = async (req, res) => {
    try {
        const { clerkId } = req.query;
        if (!clerkId)
            return res.status(400).json({ error: 'clerkId is required' });
        const products = await Product_1.Product.find({ clerkId }).sort({ createdAt: -1 });
        return res.status(200).json(products);
    }
    catch (error) {
        console.error('[PRODUCTS_GET]', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
    try {
        const { clerkId, name, price, stock } = req.body;
        if (!clerkId || !name || !price || !stock) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newProduct = await Product_1.Product.create({
            clerkId,
            name,
            price,
            stock,
            status: 'Active'
        });
        return res.status(201).json(newProduct);
    }
    catch (error) {
        console.error('[PRODUCTS_CREATE]', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createProduct = createProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { clerkId } = req.query;
        if (!clerkId || !id)
            return res.status(400).json({ error: 'clerkId and productId required' });
        await Product_1.Product.findOneAndDelete({ _id: id, clerkId });
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('[PRODUCTS_DELETE]', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteProduct = deleteProduct;
