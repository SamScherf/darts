import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { loginLimiter } from '../middleware/rateLimit.middleware';

export const authRoutes = Router();

authRoutes.post('/login', loginLimiter, login);
