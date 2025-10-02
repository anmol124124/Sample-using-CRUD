const { Sequelize } = require('sequelize');
const config = require('./database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: dbConfig.dialectOptions || {}
  }
);

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

// Sync all models with the database
async function syncModels(force = false) {
  try {
    await sequelize.sync({ force });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  Sequelize,
  testConnection,
  syncModels,
  // For backward compatibility
  query: (text, params) => sequelize.query(text, { replacements: params })
};