
const { Router } = require('express');
const { login, logout } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post('/login', login);
router.post('/logout', requireAuth, logout);

module.exports = router;
