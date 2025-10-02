const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Exam = sequelize.define('Exam', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'scheduled_at'
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    attachment_path: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'attachment_path'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'exams',
    timestamps: false, // We're managing timestamps manually
    underscored: true
  });

  // Define associations
  Exam.associate = (models) => {
    Exam.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    
    Exam.hasMany(models.File, {
      foreignKey: 'exam_id',
      as: 'files'
    });
  };

  return Exam;
};
