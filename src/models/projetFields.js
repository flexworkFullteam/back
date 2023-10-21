const { DataTypes } = require("sequelize");

module.exports = {
    name: 'ProjectFields',
    define: (sequelize) => {
        sequelize.define('ProjectFields', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4, // Puedes usar una función para generar UUIDs aleatorios
                allowNull: false
            },
            project_fields: {
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