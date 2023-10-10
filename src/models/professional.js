const { conn } = require('../DB_connection');
const { DataTypes } = require('sequelize');

const Data = {
  name: DataTypes.STRING,
  lastname: DataTypes.STRING,
  age: DataTypes.INTEGER,
  dni: DataTypes.INTEGER,
};
const DataEdu = {
  institution: DataTypes.STRING,
  year_end: DataTypes.DATE,
  degree: DataTypes.STRING,
};

const DataEx = {
  date_start: DataTypes.DATE,
  date_end: DataTypes.DATE,
  company: DataTypes.STRING,
  description: DataTypes.STRING,
};


const Professional = conn.define('Professional', {

  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },

  data: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: Data,
    validate: {
      isValidJSON(value) {
        if (!value.name || !value.email) {
          throw new Error('error validating.');
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

  nationality: {
    type: DataTypes.INTEGER,
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
  
  briefcase: {
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
  },

});

module.exports = Professional;
