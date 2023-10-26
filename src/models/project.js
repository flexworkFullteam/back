const { DataTypes, model } = require('sequelize');

const modelDependencies = {
  'Project': ['Company', 'ProjectType', 'ProjectFields', 'ExperienceLevel']
};

module.exports = {
  name: 'Project',
  define: (sequelize) => {
    const Project = sequelize.define('Project', {
      // ID autoincrementable
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Puedes usar una función para generar UUIDs aleatorios
        allowNull: false
    },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      id_company: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Companies', // Nombre del modelo de Empresa
          key: 'id' // Clave primaria en el modelo de Empresa
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      field: {
        type: DataTypes.UUID, //tabla type
        allowNull: false,
        references: {
          model: 'ProjectFields', // Nombre del modelo de Empresa
          key: 'id' // Clave primaria en el modelo de Empresa
        }
      },
      type: {
        type: DataTypes.UUID, //tabla type
        allowNull: false,
        references: {
          model: 'ProjectTypes', // Nombre del modelo de Empresa
          key: 'id' // Clave primaria en el modelo de Empresa
        }
      },
      location: {
        type: DataTypes.INTEGER,// id tabla location
        allowNull: false
      },
      //sueldo
      salary: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      exp_req: {
        type: DataTypes.UUID, //tabla?
        allowNull: false,
        references: {
          model: 'ExperienceLevels', // Nombre del modelo de Empresa
          key: 'id' // Clave primaria en el modelo de Empresa
        }
      },
      lapse: {
        type: DataTypes.INTEGER, //tiempo revisar fecha inicio y fin tipo date agegar fecha inicio
        allowNull: false
      },
      state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    });
    return Project;
  }
}