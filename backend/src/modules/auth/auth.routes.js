import { Router } from 'express';
import { login, me, register } from './auth.controller.js';
import { handleValidation } from '../../middleware/validationMiddleware.js';
import { loginValidator, registerValidator } from './auth.validators.js';
import { requireAuth } from '../../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerValidator, handleValidation, register);
router.post('/login', loginValidator, handleValidation, login);
router.get('/me', requireAuth, me);

export default router;
