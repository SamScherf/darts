import { Router } from 'express';
import { addGame } from '../controllers/game.controller';
import { validatePassword } from '../middleware/auth.middleware';

export const gameRoutes = Router();

gameRoutes.post('/add', validatePassword, addGame);
