const { DataTypes, model } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    // ID autoincrementable
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },

    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    id_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies', // Nombre del modelo de Empresa
        key: 'id' // Clave primaria en el modelo de Empresa
      }
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    tipo: {
      type: DataTypes.INTEGER, //tabla type
      allowNull: false
    },

    ubicacion: {
      type: DataTypes.INTEGER,// id tabla location
      allowNull: false
    },

    //sueldo
    sueldo: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    exp_reque: {
      type: DataTypes.STRING(255), //tabla?  ---> ERROR
      allowNull: false
    },

    lapso: {
      type: DataTypes.INTEGER, //tiempo revisar fecha inicio y fin tipo date agegar fecha inicio
      allowNull: false
    },

    conocimientos_informaticos: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },

    idiomas: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },

    id_postulantes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },

    id_ganadores: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },

    id_perdedores: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },

    state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  });

  return Project;

};