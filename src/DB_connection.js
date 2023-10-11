require("dotenv").config();
const { Sequelize } = require("sequelize");

const fs = require('fs');
const path = require('path');
const { log } = require("console");
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/flexworks`, {
  logging: false, 
  native: false, 
});

//carga automatica de modelos

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });


modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);



//Relaciones
const { Project, Professional } = sequelize.models;

Project.belongsToMany(Professional, { through: "AceptedProfessionals"});
Professional.belongsToMany(Project, { through: "AceptedProfessionals"});

Project.belongsToMany(Professional, { through: "RefusedProfessionals"});
Professional.belongsToMany(Project, { through: "RefusedProfessionals"});

Project.belongsToMany(Professional, { through: "PostulateProfessionals"});
Professional.belongsToMany(Project, { through: "PostulateProfessionals"});


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./DB_connection.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./DB_connection.js');
};