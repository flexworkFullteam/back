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
// Objeto para almacenar las definiciones de modelos
const modelDefinitions = {};

// Lee y carga las definiciones de modelos
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const modelDefiner = require(path.join(__dirname, '/models', file));
    const modelName = modelDefiner.name; // Supongamos que cada definición tiene una propiedad "name" que es el nombre del modelo
    modelDefiners.push(modelDefiner);
    modelDefinitions[modelName] = modelDefiner;
  });

// Función para cargar los modelos resolviendo dependencias
const loadModels = (modelDefs, modelDeps) => {
  const loadedModels = new Set();

  const loadModel = (modelName) => {
    if (!loadedModels.has(modelName)) {
      const modelDef = modelDefs[modelName];

      if (modelDeps[modelName]) {
        modelDeps[modelName].forEach((depName) => {
          loadModel(depName);
        });
      }
      modelDef.define(sequelize); // Carga el modelo
      loadedModels.add(modelName);
    }
  };

  // Inicializa el proceso de carga
  Object.keys(modelDefs).forEach((modelName) => {
    loadModel(modelName);
  });
};


// Define las dependencias entre modelos (supongamos que cada modelo tiene una propiedad "dependencies" que es un arreglo de nombres de modelos en los que depende)
const modelDependencies = {};
Object.keys(modelDefinitions).forEach((modelName) => {
  const dependencies = modelDefinitions[modelName].dependencies || [];
  modelDependencies[modelName] = dependencies;
});

// Carga los modelos en el orden correcto
loadModels(modelDefinitions, modelDependencies);
// Capitaliza los nombres de modelos
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(([modelName, modelDefinition]) => [modelName.charAt(0).toUpperCase() + modelName.slice(1), modelDefinition]);
sequelize.models = Object.fromEntries(capsEntries);

console.log(sequelize.models);

//Relaciones

const { Project, Professional, User, Review, Itskills, Language, Company, Nationality } = sequelize.models;

//Professional

Project.belongsToMany(Professional, { through: "Acepted_Professionals" });
Professional.belongsToMany(Project, { through: "Acepted_Professionals" });

Project.belongsToMany(Professional, { through: "Refused_Professionals" });
Professional.belongsToMany(Project, { through: "Refused_Professionals" });

Project.belongsToMany(Professional, { through: "Postulate_Professionals" });
Professional.belongsToMany(Project, { through: "Postulate_Professionals" });

Itskills.belongsToMany(Professional, { through: "Professional_Itskills" });
Professional.belongsToMany(Itskills, { through: "Professional_Itskills" });

User.hasMany(Professional, { foreignKey: 'userId' });
Professional.belongsTo(User, { foreignKey: 'userId' });

Nationality.hasMany(Professional, { foreignKey: 'id_nationality' });
Professional.belongsTo(Nationality, { foreignKey: 'id_nationality' });

Language.belongsToMany(Professional, { through: "Professional_Language" });
Professional.belongsToMany(Language, { through: "Professional_Language" });

//Company

User.hasMany(Company, { foreignKey: 'userId', as: 'companies' });
Company.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Nationality.hasMany(Company, { foreignKey: 'id_nationality', as: 'companies' });
Company.belongsTo(Nationality, { foreignKey: 'id_nationality', as: 'nationality' });

Language.belongsToMany(Company, { through: "Company_Language", as: 'Languages' });
Company.belongsToMany(Language, { through: "Company_Language", as: 'Languages' });

//Project

Itskills.belongsToMany(Project, { through: "Project_Itskills" });
Project.belongsToMany(Itskills, { through: "Project_Itskills" });

Language.belongsToMany(Project, { through: "Project_Language" });
Project.belongsToMany(Language, { through: "Project_Language" });

//Review

Review.belongsToMany(User, { through: "User_Review" });
User.belongsToMany(Review, { through: "User_Review" });






module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./DB_connection.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./DB_connection.js');
};