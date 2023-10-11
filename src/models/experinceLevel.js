const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ExperinceLevel = sequelize.define('ExperinceLevel', {
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
    
    return ExperinceLevel;
};