import { Request, Response } from 'express';
import { db } from '../config/db';

export const listUsers = (req: Request, res: Response) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving users', error: err.message });
    } else {
      res.json(rows);
    }
  });
};

export const createUser = (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    res.status(400).json({ message: "Invalid username" });
    return;
  }

  db.run(`
    INSERT INTO users (username) VALUES (?);`, [username], function(err) {
    if (err) {
      console.error('Error inserting user:', err.message);
      res.status(500).json({ message: 'Error creating user' });
    } else {
      res.json({ message: `User ${username} created successfully` });
    }
  });
};
