const { DataTypes } = require("sequelize");

module.exports = {
    name: 'ExperienceLevel',
    define: (sequelize) => {
        sequelize.define('ExperienceLevel', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4, // Puedes usar una función para generar UUIDs aleatorios
                allowNull: false
            },

            experienceLevel: {
                type: DataTypes.STRING,
                allowNull: false
            },

            state: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            }
        });
    }
}