const { query } = require('../config/db');

async function findUserByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email=$1', [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const { rows } = await query('SELECT * FROM users WHERE id=$1', [id]);
  return rows[0] || null;
}

module.exports = { findUserByEmail, findUserById };