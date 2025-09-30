const path = require('path');
const fs = require('fs');

async function download(req, res) {
  const p = req.query.path;
  if (!p) return res.status(400).json({ error: 'Path required' });
  const abs = path.resolve(p);
  if (!fs.existsSync(abs)) return res.status(404).json({ error: 'Not found' });
  res.download(abs);
}

module.exports = { download };