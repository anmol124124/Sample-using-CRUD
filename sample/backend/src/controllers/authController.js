const { models } = require('../models');
const bcrypt = require('bcryptjs');
const { signJwt } = require('../utils/jwt');
const { blacklistToken } = require('../config/redis');

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { token, jti, exp } = signJwt(user.id, user.role);
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      jti, 
      exp 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
}

async function logout(req, res) {
  const auth = req.auth;
  if (!auth) {
    return res.status(200).json({ ok: true });
  }
  
  try {
    await blacklistToken(auth.jti, auth.exp);
    res.json({ ok: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'An error occurred during logout' });
  }
}

async function createFile(rec) {
  try {
    const file = await models.File.create({
      examId: rec.exam_id,
      filename: rec.filename,
      originalname: rec.originalname,
      mimetype: rec.mimetype,
      size: rec.size_bytes,
      path: rec.path,
      uploadedBy: rec.uploaded_by
    });
    return file;
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

module.exports = { 
  login, 
  logout, 
  createFile 
};

