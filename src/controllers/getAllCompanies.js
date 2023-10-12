const axios = require("axios");
const { Company } = require("../DB_connection");

module.exports = async (req, res) => {

    try {
        const response = await Company.findAll();
        
    } catch (error) {
        
    }

};