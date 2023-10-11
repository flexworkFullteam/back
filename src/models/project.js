
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        /*
        empresa:{
            id relacional
        }

        conocimientos informaticos:{
            [ids] relacional
        }

        idiomas:{
            [ids] relacional
        }
        */
    });

    return Project;
};