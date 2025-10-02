const http = require('http');
const app = require('./app');
const { testConnection, syncModels } = require('./config/db');
const env = process.env;
require('dotenv').config();

const port = Number(env.PORT) || 4000;
const server = http.createServer(app);

// Initialize database connection and sync models
async function initializeServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Sync models with database
    // Set force to true to drop and recreate tables (use with caution in production)
    const forceSync = process.env.NODE_ENV === 'development' && process.env.FORCE_SYNC === 'true';
    await syncModels(forceSync);
    
    // Start the server
    server.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

// Initialize the server
initializeServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
