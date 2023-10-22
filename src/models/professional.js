const { DataTypes } = require('sequelize');


const modelDependencies = {
  'Professional': ['User', 'Nationality']
};

module.exports = {
  name: 'Professional',
  define: (sequelize) => {
    const Professional = sequelize.define('Professional', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
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

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      dni: {
        type: DataTypes.INTEGER,
        allowNull: false
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
                typeof obj.date_start !== 'string' ||
                typeof obj.date_end !== 'string' ||
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
                typeof obj.year_end !== 'string' ||
                typeof obj.degree !== 'string' ||
                typeof obj.institution !== 'string'
              ) {
                throw new Error('Cada objeto en experience debe tener la estructura correcta.');
              }
            }
          },
        },
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
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    });
    return Professional;
  }
}
