const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../config/redis');
const { ROLES } = require('../utils/roles');
require('dotenv').config();

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = {
      userId: decoded.sub,
      role: decoded.role,
      jti: decoded.jti,
      exp: decoded.exp
    };

    isTokenBlacklisted(req.auth.jti)
      .then(blacklisted => {
        if (blacklisted) return res.status(401).json({ error: 'Token revoked' });
        next();
      })
      .catch(next);
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.auth;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { requireAuth, requireRole, ROLES };