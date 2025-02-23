import express from 'express';
import cors from 'cors';
import { userRoutes } from './routes/user.routes';
import { gameRoutes } from './routes/game.router';
import { statsRoutes } from './routes/stats.router';
import { authRoutes } from './routes/auth.router';

const PORT = 5000;

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

