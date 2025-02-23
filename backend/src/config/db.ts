import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('../../database.db', (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY
  );
`);

// Create throws table
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
`);
