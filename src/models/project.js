const { DataTypes, Model } = require('sequelize');
const sequelize = require('./db.js'); // Importando la conexión a la base de datos

class Project extends Model {}

Project.init({
  // ID autoincrementable
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  id_empresa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Empresas', // Nombre de la tabla referenciada
      key: 'id' // Clave primaria referenciada en la tabla Empresas
    }
  },
  id_professional: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Professionals', // Nombre de la tabla referenciada
      key: 'id' // Clave primaria referenciada en la tabla Professionals
    }
  },
  idioma: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      notEmpty: false
    }
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  area: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  exp_reque: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  lapso: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  conocimientos_informaticos: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true
  },
  idiomas: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true
  },
  area_empresa: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true
  },
  experiencia_requerida: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  id_ubicacion: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  postulantes: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true
  },
  ganadores: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true
  },
  perdedores: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Project',
  tableName: 'proyectos', // nombre de la tabla en la base de datos
  timestamps: true,      // Esto agregará los campos `created_at` y `updated_at`
  underscored: true,     // Esto garantizará que las columnas generadas por sequelize sigan el patrón snake_case
});

module.exports = Project;
