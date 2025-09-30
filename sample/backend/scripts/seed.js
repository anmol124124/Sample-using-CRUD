const { pool } = require('../src/config/db');
const { hashPassword } = require('../src/utils/password');

async function run() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const passwordHash = await hashPassword(adminPassword);

  await pool.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1,$2,'ADMIN')
     ON CONFLICT (email) DO UPDATE SET role=EXCLUDED.role`,
    [adminEmail, passwordHash]
  );

  console.log(`Seeded admin user: ${adminEmail}`);
  await pool.end();
}

run().catch(async (err) => {
  console.error('Seed failed:', err);
  try { await pool.end(); } catch (_) {}
  process.exit(1);
});


