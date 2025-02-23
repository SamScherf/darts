import { Request, Response } from 'express';
import { db } from '../config/db';

export const getRawAverages = (req: Request, res: Response) => {
  const query = `SELECT user, AVG(value) AS averageScore FROM throws GROUP BY user;`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Error retrieving average scores" });
    }

    res.status(200).json(rows);
  });
};
