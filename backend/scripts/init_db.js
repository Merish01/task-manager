const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function run() {
  try {
    const sqlPath = path.join(__dirname, '..', 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying schema from', sqlPath);
    await pool.query(sql);
    console.log('Database schema applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to apply schema:', err.message || err);
    process.exit(1);
  }
}

run();
