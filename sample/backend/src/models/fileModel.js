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