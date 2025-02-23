import { rateLimit } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many attempts, please try again later.',
});