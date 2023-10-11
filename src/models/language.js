const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const language = sequelize.define('Language', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    });
    return language;
};