const { models } = require('../models');
const { Op } = require('sequelize');

async function list(req, res) {
  try {
    const exams = await models.Exam.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          model: models.User,
          as: 'creator',
          attributes: ['id', 'email', 'role']
        },
        {
          model: models.File,
          as: 'files'
        }
      ]
    });
    
    // Transform response for frontend compatibility
    const transformedExams = exams.map(exam => {
      const examData = exam.toJSON();
      return {
        ...examData,
        startTime: examData.scheduled_at,
        endTime: examData.scheduled_at,
        createdBy: examData.created_by,
        createdAt: examData.created_at,
        updatedAt: examData.updated_at
      };
    });
    
    res.json(transformedExams);
  } catch (error) {
    console.error('Error listing exams:', error);
    res.status(500).json({ error: 'Failed to list exams' });
  }
}

async function get(req, res) {
  try {
    const exam = await models.Exam.findByPk(req.params.id, {
      include: [
        {
          model: models.User,
          as: 'creator',
          attributes: ['id', 'email', 'role']
        },
        {
          model: models.File,
          as: 'files'
        }
      ]
    });
    
    if (!exam) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    // Transform response for frontend compatibility
    const examData = exam.toJSON();
    const response = {
      ...examData,
      startTime: examData.scheduled_at,
      endTime: examData.scheduled_at,
      createdBy: examData.created_by,
      createdAt: examData.created_at,
      updatedAt: examData.updated_at
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting exam:', error);
    res.status(500).json({ error: 'Failed to get exam' });
  }
}

async function create(req, res) {
  // Support both old and new field names for backward compatibility
  const { 
    title, 
    description, 
    scheduled_at, 
    startTime, 
    endTime 
  } = req.body || {};
  
  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }

  try {
    // Use scheduled_at if provided, otherwise use startTime for backward compatibility
    const scheduledTime = scheduled_at || startTime || null;
    
    const exam = await models.Exam.create({
      title,
      description: description || null,
      scheduled_at: scheduledTime,
      created_by: req.auth.userId,
      attachment_path: req.file ? req.file.path : null,
      updated_at: new Date()
    });

    if (req.file) {
      await models.File.create({
        exam_id: exam.id,
        filename: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size_bytes: req.file.size,
        uploaded_by: req.auth.userId
      });
    }

    // Fetch the created exam with associations
    const createdExam = await models.Exam.findByPk(exam.id, {
      include: [
        {
          model: models.User,
          as: 'creator',
          attributes: ['id', 'email', 'role']
        },
        {
          model: models.File,
          as: 'files'
        }
      ]
    });

    // Transform response to include both old and new field names for frontend compatibility
    const response = createdExam.toJSON();
    response.startTime = response.scheduled_at;
    response.endTime = response.scheduled_at;
    response.createdBy = response.created_by;

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
}

async function update(req, res) {
  // Support both old and new field names for backward compatibility
  const { 
    title, 
    description, 
    scheduled_at, 
    startTime, 
    endTime 
  } = req.body || {};
  
  try {
    const exam = await models.Exam.findByPk(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Update exam fields
    if (title !== undefined) exam.title = title;
    if (description !== undefined) exam.description = description;
    
    // Use scheduled_at if provided, otherwise use startTime for backward compatibility
    const scheduledTime = scheduled_at || startTime;
    if (scheduledTime !== undefined) exam.scheduled_at = scheduledTime;
    
    if (req.file) exam.attachment_path = req.file.path;
    exam.updated_at = new Date();

    await exam.save();

    if (req.file) {
      await models.File.create({
        exam_id: exam.id,
        filename: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size_bytes: req.file.size,
        uploaded_by: req.auth.userId
      });
    }

    // Fetch the updated exam with associations
    const updatedExam = await models.Exam.findByPk(exam.id, {
      include: [
        {
          model: models.User,
          as: 'creator',
          attributes: ['id', 'email', 'role']
        },
        {
          model: models.File,
          as: 'files'
        }
      ]
    });

    // Transform response for frontend compatibility
    const response = updatedExam.toJSON();
    response.startTime = response.scheduled_at;
    response.endTime = response.scheduled_at;
    response.createdBy = response.created_by;
    response.createdAt = response.created_at;
    response.updatedAt = response.updated_at;

    res.json(response);
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ error: 'Failed to update exam' });
  }
}

async function remove(req, res) {
  try {
    const exam = await models.Exam.findByPk(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ error: 'Not found' });
    }

    await exam.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ error: 'Failed to delete exam' });
  }
}

module.exports = { list, get, create, update, remove };