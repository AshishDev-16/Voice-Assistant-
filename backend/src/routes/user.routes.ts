import { Router } from 'express';
import { saveCredentials } from '../controllers/user.controller';

const router = Router();

router.post('/credentials', saveCredentials);

export default router;
