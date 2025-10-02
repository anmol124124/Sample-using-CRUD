require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./config/db');
const { redis } = require('./config/redis');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const fileRoutes = require('./routes/fileRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 60_000, max: 200 });
app.use(limiter);

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/health/db', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true, db: true });
  } catch (err) {
    console.error('Database health check failed:', err);
    res.status(500).json({ ok: false, error: 'DB not reachable' });
  }
});
app.get('/health/redis', async (_req, res) => {
  try {
    const pong = await redis.ping();
    res.json({ ok: pong === 'PONG' });
  } catch (err) {
    console.error('Redis health check failed:', err);
    res.status(500).json({ ok: false, error: 'Redis not reachable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/files', fileRoutes);

app.use(errorHandler);

module.exports = app;