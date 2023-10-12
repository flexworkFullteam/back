const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('ExperienceLevel', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        experinceLevel: {
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