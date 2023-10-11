const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const location = sequelize.define('Location', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    });
    return location;
};