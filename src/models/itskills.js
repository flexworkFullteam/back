const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('itskills', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
};
