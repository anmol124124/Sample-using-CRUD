const { createExam, deleteExam, getExam, listExams, updateExam } = require('../models/examModel');
const { createFile } = require('../models/fileModel');

async function list(req, res) {
  const exams = await listExams();
  res.json(exams);
}

async function get(req, res) {
  const exam = await getExam(req.params.id);
  if (!exam) return res.status(404).json({ error: 'Not found' });
  res.json(exam);
}

async function create(req, res) {
  const { title, description, scheduled_at } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });

  const exam = await createExam({
    title,
    description: description || null,
    scheduled_at: scheduled_at || null,
    created_by: req.auth.userId,
    attachment_path: req.file ? req.file.path : null
  });

  if (req.file) {
    await createFile({
      exam_id: exam.id,
      filename: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size_bytes: req.file.size,
      uploaded_by: req.auth.userId
    });
  }

  res.status(201).json(exam);
}

async function update(req, res) {
  const { title, description, scheduled_at } = req.body || {};
  const updated = await updateExam(req.params.id, {
    title,
    description,
    scheduled_at,
    attachment_path: req.file ? req.file.path : undefined
  });
  if (!updated) return res.status(404).json({ error: 'Not found' });

  if (req.file) {
    await createFile({
      exam_id: updated.id,
      filename: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size_bytes: req.file.size,
      uploaded_by: req.auth.userId
    });
  }

  res.json(updated);
}

async function remove(req, res) {
  await deleteExam(req.params.id);
  res.status(204).send();
}

module.exports = { list, get, create, update, remove };