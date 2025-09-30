const http = require('http');
const app = require('./app');
const env = process.env;
require('dotenv').config();

const port = Number(env.PORT) || 4000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});