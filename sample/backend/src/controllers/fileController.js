const path = require('path');
const fs = require('fs');
const { models } = require('../models');

async function download(req, res) {
  const p = req.query.path;
  if (!p) {
    return res.status(400).json({ error: 'Path required' });
  }
  
  try {
    const abs = path.resolve(p);
    if (!fs.existsSync(abs)) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.download(abs);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
}

async function list(req, res) {
  try {
    const { examId, exam_id } = req.query;
    
    const where = {};
    if (examId || exam_id) {
      where.exam_id = examId || exam_id;
    }
    
    const files = await models.File.findAll({
      where,
      include: [
        {
          model: models.User,
          as: 'uploader',
          attributes: ['id', 'email']
        },
        {
          model: models.Exam,
          as: 'exam',
          attributes: ['id', 'title']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(files);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
}

async function get(req, res) {
  try {
    const file = await models.File.findByPk(req.params.id, {
      include: [
        {
          model: models.User,
          as: 'uploader',
          attributes: ['id', 'email']
        },
        {
          model: models.Exam,
          as: 'exam',
          attributes: ['id', 'title']
        }
      ]
    });
    
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    res.json(file);
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ error: 'Failed to get file' });
  }
}

async function remove(req, res) {
  try {
    const file = await models.File.findByPk(req.params.id);
    
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    // Delete the physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    
    // Delete the database record
    await file.destroy();
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
}

module.exports = { download, list, get, remove };