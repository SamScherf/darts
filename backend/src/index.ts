import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

const PORT = 5000;

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());

dotenv.config();

// Allow 5 attempts per minute
const passwordLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many attempts, please try again later.',
});
app.post('/validate-password', passwordLimiter, (req, res) => {
  const { password } = req.body;

  if (password === process.env.MASTERPASSWORD) {
    res.json({message: "Success"})
  } else {
    res.status(401).json({message: "Invalid password"})
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

