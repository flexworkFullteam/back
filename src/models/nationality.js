const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const nationality = sequelize.define('Nationality', {
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
        }
    });
    return nationality;
};