const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ITSkills = sequelize.define('itskills', {
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
        }
    });
    return ITSkills;
};
