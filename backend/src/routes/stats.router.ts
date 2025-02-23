import { Router } from 'express';
import { getRawAverages } from '../controllers/stats.controller';
import { validatePassword } from '../middleware/auth.middleware';

export const statsRoutes = Router();

statsRoutes.post('/raw-averages', validatePassword, getRawAverages);
