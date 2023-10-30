const { DataTypes, model } = require('sequelize');

const modelDependencies = {
  'Project': ['Company', 'ProjectType', 'ProjectFields', 'ExperienceLevel','Province','Nation']
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
      nation_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Nations', // Nombre del modelo de Empresa
          key: 'id' // Clave primaria en el modelo de Empresa
        }
      },
      province_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Provinces', // Nombre del modelo de Empresa
          key: 'id' // Clave primaria en el modelo de Empresa
        }
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
      calendly: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      mpTransferencia: {
        type: DataTypes.INTEGER
      },
      pagado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      finalizado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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