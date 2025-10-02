const { Sequelize } = require('sequelize');
const config = require('../config/database');

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

const db = {
  sequelize,
  Sequelize,
  models: {}
};

// Import models
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Exam = require('./exam')(sequelize, Sequelize.DataTypes);
const File = require('./file')(sequelize, Sequelize.DataTypes);

// Add models to db object
db.models.User = User;
db.models.Exam = Exam;
db.models.File = File;

// Setup associations if needed
Object.keys(db.models).forEach(modelName => {
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db.models);
  }
});

module.exports = db;
