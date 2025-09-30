const { Router } = require('express');
const { create, get, list, remove, update } = require('../controllers/examController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = Router();

router.get('/', requireAuth, list);
router.get('/:id', requireAuth, get);

router.post('/', requireAuth, requireRole('ADMIN', 'TEACHER'), upload.single('attachment'), create);
router.put('/:id', requireAuth, requireRole('ADMIN', 'TEACHER'), upload.single('attachment'), update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), remove);

module.exports = router;