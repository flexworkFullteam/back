
const { DataTypes } = require('sequelize');

const modelDependencies = {
    'Company': ['User', 'Nationality']
};

const data = {
    nombre: DataTypes.STRING,
    telefono: DataTypes.INTEGER,
    email: DataTypes.STRING,
    horario: DataTypes.STRING,
    contacto: DataTypes.STRING
};

module.exports = {
    name: 'Company',
    define: (sequelize) => {
        sequelize.define('Company', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Nombre del modelo de usuario
                    key: 'id',      // Clave primaria en el modelo de usuario
                },
            },
            id_nationality: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Nationalities', // Nombre del modelo de usuario
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
                //type: DataTypes.DATE,
                type: DataTypes.STRING,
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
                            typeof value.horario !== 'string' ||
                            typeof value.contacto !== 'string'
                        )
                            throw new Error("Error: revisa las propiedades del objeto data");
                    }
                }
            },
            Bank_account: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true
            },
            state: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            }
        });
    }
};