
const { DataTypes } = require('sequelize');

const data = {
    nombre: DataTypes.STRING,
    telefono: DataTypes.INTEGER,
    email: DataTypes.STRING,
    nacionalidad: DataTypes.INTEGER,
    idioma: DataTypes.ARRAY(DataTypes.INTEGER),
    horario: DataTypes.STRING,
    contacto: DataTypes.STRING
};

module.exports = (sequelize) => {
    const Company = sequelize.define('Company', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Users', // Nombre del modelo de usuario
                key: 'id',      // Clave primaria en el modelo de usuario
            },
        },
        business_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activity_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        fiscal_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        legal_representative: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: data,
            validate: {
                isValidData(value) {
                    if (
                        typeof value.nombre !== 'string' ||
                        typeof value.telefono !== 'number' ||
                        typeof value.email !== 'string' ||
                        typeof value.nacionalidad !== 'number' ||
                        typeof value.idioma !== 'objet' ||
                        typeof value.horario !== 'string' ||
                        typeof value.contacto !== 'string'
                    )
                        throw new Error("Error: las propiedades deben ser string");
                }
            }
        },
        Bank_account: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    });

    return Company;
};