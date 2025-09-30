const { query } = require('../config/db');

async function createFile(rec) {
  const { rows } = await query(
    `INSERT INTO files (exam_id, filename, path, mimetype, size_bytes, uploaded_by)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [rec.exam_id, rec.filename, rec.path, rec.mimetype, rec.size_bytes, rec.uploaded_by]
  );
  return rows[0];
}

module.exports = { createFile };
const { findUserByEmail } = require('../models/userModel');
const { verifyPassword } = require('../utils/password');
const { signJwt } = require('../utils/jwt');
const { blacklistToken } = require('../config/redis');

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const { token, jti, exp } = signJwt(user.id, user.role);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role }, jti, exp });
}

async function logout(req, res) {
  const auth = req.auth;
  if (!auth) return res.status(200).json({ ok: true });
  await blacklistToken(auth.jti, auth.exp);
  res.json({ ok: true });
}

module.exports = { login, logout };

