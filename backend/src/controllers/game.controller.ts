import { Request, Response } from 'express';
import { db } from '../config/db';

export const addGame = (req: Request, res: Response) => {
  const { throws } = req.body;

  if (!Array.isArray(throws)) {
    res.status(400).json({ message: "Invalid input, expected an array of throws" });
    return;
  }

  const insertQuery = `
    INSERT INTO throws (value, user, throwIndex, turnIndex, hit, modifier, startingScore) 
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  const errors: any[] = [];
  db.serialize(() => {
    const statement = db.prepare(insertQuery);

    throws.forEach((throwData, index) => {
      const { value, user, throwIndex, turnIndex, hit, modifier, startingScore } = throwData;

      if (!user || value == null || throwIndex == null || turnIndex == null || hit == null || startingScore == null) {
        errors.push({ index, message: "Missing required fields" });
        return;
      }

      statement.run(value, user, throwIndex, turnIndex, hit, modifier || null, startingScore, (err: any) => {
        if (err) {
          errors.push({ index, message: err.message });
        }
      });
    });

    statement.finalize();
  });

  if (errors.length > 0) {
    res.status(400).json({ message: "Some throws failed", errors });
    return;
  }

  res.status(200).json({ message: "Game successfully saved" });
};
