const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const File = sequelize.define('File', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    exam_id: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'exam_id',
      references: {
        model: 'exams',
        key: 'id'
      }
    },
    filename: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mimetype: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    size_bytes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'size_bytes'
    },
    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'uploaded_by',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'files',
    timestamps: false,
    underscored: true
  });

  // Define associations
  File.associate = (models) => {
    File.belongsTo(models.Exam, {
      foreignKey: 'exam_id',
      as: 'exam'
    });
    
    File.belongsTo(models.User, {
      foreignKey: 'uploaded_by',
      as: 'uploader'
    });
  };

  return File;
};
