const { conn } = require('../DB_connection'); 
const { DataTypes } = require('sequelize');

const Data = {
    name: '',
    lastname: '',   
    age: 0,
    dni: 0,
};
const DataEdu = {
    fecha_ini: '',
    lastname: '',   
    age: 0,
    dni: 0,
};

const DataEx = {
    date_start: DataTypes.DATE,
    date_end: DataTypes.DATE,
    company: DataTypes.STRING,
    description: DataTypes.STRING,
};
  

const Professional = conn.define('Professional', {
    id:{
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
      defaultValue: [], // Valor por defecto: un array vacío
      validate: {
        isValidExperienceArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('experience debe ser un array de objetos.');
          }
          // Valida cada objeto en el array contra la estructura de DataEx
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

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    tipe:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    state:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },

});

module.exports = Professional;
