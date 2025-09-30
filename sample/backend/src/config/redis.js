const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

async function blacklistToken(jti, expUnixSec) {
  const now = Math.floor(Date.now() / 1000);
  const ttl = Math.max(expUnixSec - now, 0);
  if (ttl > 0) {
    await redis.set(getKey(jti), '1', 'EX', ttl);
  }
}

async function isTokenBlacklisted(jti) {
  const val = await redis.get(getKey(jti));
  return val === '1';
}

function getKey(jti) {
  return `jwt:blacklist:${jti}`;
}

module.exports = { redis, blacklistToken, isTokenBlacklisted };