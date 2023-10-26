const { DataTypes } = require("sequelize");

module.exports = {
    name: 'itskills',
    define: (sequelize) => {
        sequelize.define('itskills', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4, // Puedes usar una función para generar UUIDs aleatorios
                allowNull: false
            },
            it_skill: {
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
