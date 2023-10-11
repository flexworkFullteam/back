const { DataTypes } = require('sequelize');

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

    /*
    id_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company', // Nombre de la tabla referenciada
        key: 'id' // Clave primaria referenciada en la tabla Empresas
      }
    },*/

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
      type: DataTypes.STRING(255), //tabla?
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

    postulantes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },

    ganadores: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },

    perdedores: {
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