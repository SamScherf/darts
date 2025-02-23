import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  if (password === process.env.MASTERPASSWORD) {
    next();
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
};
