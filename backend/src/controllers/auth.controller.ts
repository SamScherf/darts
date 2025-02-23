import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// TODO: Make this a real login instead
export const login = (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === process.env.MASTERPASSWORD) {
    res.json({ message: "Success" });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
};