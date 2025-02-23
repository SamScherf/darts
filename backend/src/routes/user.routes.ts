import { Router } from 'express';
import { listUsers, createUser } from '../controllers/user.controller';
import { validatePassword } from '../middleware/auth.middleware';

export const userRoutes = Router();

userRoutes.post('/list', validatePassword, listUsers);
userRoutes.post('/create', validatePassword, createUser);
