import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import sqlite3 from 'sqlite3';

const PORT = 5000;

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());

// Connect to SQLite database or create new database file if it doesn't exist
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create the users table if it doesn't exist already
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS throws (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value INTEGER NOT NULL,
      user TEXT NOT NULL,
      throwIndex INTEGER NOT NULL,
      turnIndex INTEGER NOT NULL,
      hit INTEGER NOT NULL,
      modifier TEXT,
      startingScore INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

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

app.post('/users', (req, res) => {
  const { password } = req.body;

  // Check password first
  if (password !== process.env.MASTERPASSWORD) {
    res.status(401).json({message: "Invalid password"})
    return;
  }

  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving users', error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/create-user', (req, res) => {
  const { password, username } = req.body;

  // Check password first
  if (password !== process.env.MASTERPASSWORD) {
    res.status(401).json({message: "Invalid password"})
    return;
  }

  if (username == null) {
    res.status(401).json({message: "Username invalid"})
    return;
  }

  db.run(`
    INSERT INTO users (username) VALUES (?);
  `, [username], function(err) {
    if (err) {
      console.error('Error inserting user:', err.message);
      res.status(500).json({ message: 'Error creating user' });
    } else {
      res.json({ message: `User ${username} created successfully` });
    }
  });
});

app.post('/add-game', (req, res) => {
  const { password, throws } = req.body;

  // Check password first
  if (password !== process.env.MASTERPASSWORD) {
    res.status(401).json({message: "Invalid password"})
    return;
  }

  // Ensure throws is proper array
  if (!Array.isArray(throws)) {
    res.status(400).json({ error: "Invalid input, expected an array of throws" });
    return;
  }

  const insertQuery = `
        INSERT INTO throws (value, user, throwIndex, turnIndex, hit, modifier, startingScore) 
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const errors: any = [];
    db.serialize(() => {
        const statment = db.prepare(insertQuery);

        throws.forEach((throwData, index) => {
            const { value, user, throwIndex, turnIndex, hit, modifier, startingScore } = throwData;

            // Validate required fields
            if (
                value == null ||
                !user ||
                throwIndex == null ||
                turnIndex == null ||
                hit == null ||
                startingScore == null
            ) {
                errors.push({ index, message: "Missing required fields" });
                return;
            }

            statment.run(
                value,
                user,
                throwIndex,
                turnIndex,
                hit,
                modifier || null,
                startingScore,
                (err: any) => {
                    if (err) {
                        errors.push({ index, message: err.message });
                    }
                }
            );
        });

        statment.finalize();
    });

    if (errors.length > 0) {
        res.status(400).json({ message: "Some throws failed", errors });
        return;
    }

    res.status(200).json({ message: "Game successfully saved" });

});

app.post('/get-raw-averages', (req, res) => {
  const { password } = req.body;

  // Check password first
  if (password !== process.env.MASTERPASSWORD) {
    res.status(401).json({message: "Invalid password"})
    return;
  }

  const query = `
  SELECT user, AVG(value) AS averageScore
  FROM throws
  GROUP BY user;
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: "Error retrieving average scores" });
      return;
    }

    res.status(200).json(rows);
  });

});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

