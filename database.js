// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./waste.db'); // creates or opens the DB file

// Create table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS waste_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wasteType TEXT,
            recyclableMaterials TEXT,
            quantity REAL,
            location TEXT,
            pickupTime TEXT,
            email TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;
