const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Professional', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Nombre del modelo de usuario
        key: 'id',      // Clave primaria en el modelo de usuario
      },
    },
    id_nationality: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Nationalities', // Nombre del modelo de usuario
        key: 'id',      // Clave primaria en el modelo de usuario
      },
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        name: DataTypes.STRING,
        lastname: DataTypes.STRING,
        age: DataTypes.INTEGER,
        dni: DataTypes.INTEGER,
      },
      validate: {
        isValidJSON(value) {
          if (!value.name || !value.lastname || !value.age || !value.dni) {
            throw new Error('Error de validación.');
          }
        },
      },
    },
    experience: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidExperienceArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('experience debe ser un array de objetos.');
          }
          for (const obj of value) {
            if (
              typeof obj.date_start !== 'object' ||
              typeof obj.date_end !== 'object' ||
              typeof obj.company !== 'string' ||
              typeof obj.description !== 'string'
            ) {
              throw new Error('Cada objeto en experience debe tener la estructura correcta.');
            }
          }
        },
      },
    },
    education: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidExperienceArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('experience debe ser un array de objetos.');
          }
          for (const obj of value) {
            if (
              typeof obj.year_end !== 'object' ||
              typeof obj.degree !== 'string' ||
              typeof obj.institution !== 'string'
            ) {
              throw new Error('Cada objeto en experience debe tener la estructura correcta.');
            }
          }
        },
      },
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    development_skills: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    extra_information: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    portfolio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cci: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  });
};
