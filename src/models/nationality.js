const { DataTypes } = require("sequelize");

module.exports = {
    name: 'Nationality',
    define: (sequelize) => {
        sequelize.define('Nationality', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            nationality: {
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