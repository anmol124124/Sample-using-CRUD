const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const { pool } = require('../src/config/db');

async function run() {
  const migrationsDir = join(__dirname, '..', 'src', 'migrations');
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sqlPath = join(migrationsDir, file);
    const sql = readFileSync(sqlPath, 'utf8');
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }
  console.log('All migrations completed');
  await pool.end();
}

run().catch(async (err) => {
  console.error('Migration failed:', err);
  try { await pool.end(); } catch (_) {}
  process.exit(1);
});


