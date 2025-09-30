const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

function signJwt(subject, role) {
  const jti = uuidv4();
  const token = jwt.sign({ role }, process.env.JWT_SECRET, {
    subject,
    jwtid: jti,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
  const decoded = jwt.decode(token);
  return { token, jti, exp: decoded.exp };
}

module.exports = { signJwt };