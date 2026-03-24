import { Router } from 'express';
import { getProducts, createProduct, deleteProduct } from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.delete('/:id', deleteProduct);

export default router;
