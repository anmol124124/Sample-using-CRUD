const { Router } = require('express');
const { download } = require('../controllers/fileController');
const { requireAuth } = require('../middleware/auth');

const router = Router();
router.get('/download', requireAuth, download);

module.exports = router;