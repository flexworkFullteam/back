const axios = require("axios");
const { Company } = require("../DB_connection");


const getCompanies = async (req, res) => {
    try {
        const data = await Company.findAll(
            {
                where: {
                    state: true
                }
            }
        );
        if (data) {
            const response = [];
            data.map(company =>
                response.push({
                    businessName: company.business_name,
                    activityType: company.activity_type,
                    startDate: company.start_date,
                    fiscalAddress: company.fiscal_address,
                    legalRepresentative: company.legal_representative,
                    contactData: company.data,
                    bankAccount: company.Bank_account,
                    createdAt: company.createdAt
                })
            );
            return res.status(200).json(response);
        }
        else
            return res.status(400).send("Error la busqueda de compañias");

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }

};

const getCompanyById = async (req, res) => {

    const { id } = req.params;
    if (id) {
        try {
            const company = await Company.findByPk(id)
            if (company) {
                const response = {
                    businessName: company.business_name,
                    activityType: company.activity_type,
                    startDate: company.start_date,
                    fiscalAddress: company.fiscal_address,
                    legalRepresentative: company.legal_representative,
                    contactData: company.data,
                    bankAccount: company.Bank_account,
                    createdAt: company.createdAt
                };
                return res.status(200).json(response);
            }
            else
                return res.status(400).send("Error en la busqueda por id");

        } catch (error) {
            res.status(500).send(error.message);
        }
    }
    else
        res.status(400).send("No se detecto un id valido");

}

const postCompany = async (req, res) => {
    //console.log(req.body);
    const { businessName, activityType, startDate, fiscalAddress, legalRepresentative, data, bankAccount } = req.body;
    if (businessName && activityType && startDate && fiscalAddress && legalRepresentative && data && bankAccount)
        try {
            const [newCompany, created] = await Company.findOrCreate(
                {
                    where: { business_name: businessName },
                    defaults: {
                        activity_type: activityType,
                        start_date: startDate,
                        fiscal_address: fiscalAddress,
                        legal_representative: legalRepresentative,
                        data: data,
                        Bank_account: bankAccount,
                        /*userId: 1,
                        id_nationality:1*/
                    }
                })
            console.log(newCompany, "-----", created);
            if (created)
                return res.status(200).send("Se creo, exitosamente la empresa");
            else
                return res.status(400).send("nombre de empresa ya existe");

        } catch (error) {
            return res.status(500).send(error.message);
        }


};

module.exports = {
    getCompanies,
    getCompanyById,
    postCompany,
};