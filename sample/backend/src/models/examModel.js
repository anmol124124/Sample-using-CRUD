const { query } = require('../config/db');

async function listExams() {
  const { rows } = await query('SELECT * FROM exams ORDER BY created_at DESC');
  return rows;
}

async function getExam(id) {
  const { rows } = await query('SELECT * FROM exams WHERE id=$1', [id]);
  return rows[0] || null;
}

async function createExam(input) {
  const { rows } = await query(
    `INSERT INTO exams (title, description, scheduled_at, created_by, attachment_path)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [input.title, input.description || null, input.scheduled_at || null, input.created_by, input.attachment_path || null]
  );
  return rows[0];
}

async function updateExam(id, input) {
  const { rows } = await query(
    `UPDATE exams
     SET title=COALESCE($2, title),
         description=COALESCE($3, description),
         scheduled_at=COALESCE($4, scheduled_at),
         attachment_path=COALESCE($5, attachment_path),
         updated_at=NOW()
     WHERE id=$1
     RETURNING *`,
    [id, input.title ?? null, input.description ?? null, input.scheduled_at ?? null, input.attachment_path ?? null]
  );
  return rows[0] || null;
}

async function deleteExam(id) {
  await query('DELETE FROM exams WHERE id=$1', [id]);
}

module.exports = { listExams, getExam, createExam, updateExam, deleteExam };