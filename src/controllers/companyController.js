const { Company } = require("../DB_connection");
const { User, Nationality, Language } = require("../DB_connection");
const { Op } = require("sequelize");

const getCompanies = async (req, res) => {
    try {
        const data = await Company.findAll(
            {
                where: {
                    state: true
                },
                include: [
                    { model: User, as: 'user' }, // Relación con el modelo User (userId)
                    { model: Nationality, as: 'nationality' }, // Relación con el modelo Nationality (id_nationality)
                    {
                        model: Language,
                        as: "Languages",
                        attributes: ['language'], // Puedes especificar las columnas que deseas seleccionar
                        through: { attributes: [] } // Excluye las columnas de la tabla intermedia si no las necesitas
                    }
                ]
            })
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
                    createdAt: company.createdAt,
                    id_nationality: company.nationality.nationality, // Obtiene el nombre de la nacionalidad
                    userId: company.user.username, // Obtiene el nombre de usuario
                    languages: company.Languages.map(language => language.dataValues.language) // Obtiene los nombres de los idiomas
                })
            );
            return res.status(200).json(response);
        }
        else
            return res.status(400).send("Error la busqueda de compañias");

    } catch (error) {
        return res.status(500).send(error.message);
    }

};

const getCompanyById = async (req, res) => {

    const { id } = req.params;
    if (id) {
        try {
            const company = await Company.findByPk(id,
                {
                    where: {
                        state: true
                    },
                    include: [
                        { model: User, as: 'user' }, // Relación con el modelo User (userId)
                        { model: Nationality, as: 'nationality' }, // Relación con el modelo Nationality (id_nationality)
                        {
                            model: Language,
                            as: "Languages",
                            attributes: ['language'], // Puedes especificar las columnas que deseas seleccionar
                            through: { attributes: [] } // Excluye las columnas de la tabla intermedia si no las necesitas
                        }
                    ]
                })
            if (company) {
                const response = {
                    businessName: company.business_name,
                    activityType: company.activity_type,
                    startDate: company.start_date,
                    fiscalAddress: company.fiscal_address,
                    legalRepresentative: company.legal_representative,
                    contactData: company.data,
                    bankAccount: company.Bank_account,
                    createdAt: company.createdAt,
                    id_nationality: company.nationality.nationality, // Obtiene el nombre de la nacionalidad
                    userId: company.user.username, // Obtiene el nombre de usuario
                    languages: company.Languages.map(language => language.dataValues.language) // Obtiene los nombres de los idiomas
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
    const { businessName, activityType, startDate, fiscalAddress, legalRepresentative, data, bankAccount, nationalityId, userId, languages } = req.body;
    //console.log(typeof languages);
    if (businessName && activityType && startDate && fiscalAddress && legalRepresentative && data && bankAccount && nationalityId && userId && languages)
        try {
            const [newCompany, created] = await Company.findOrCreate(
                {
                    where: { business_name: businessName },
                    defaults: {
                        userId: userId,
                        activity_type: activityType,
                        start_date: startDate,
                        fiscal_address: fiscalAddress,
                        legal_representative: legalRepresentative,
                        data: data,
                        Bank_account: bankAccount,
                        id_nationality: nationalityId,
                    }
                })
            if (created) {
                const languageToSet = await Language.findAll({
                    where: {
                        id: { [Op.in]: languages },
                    }
                });
                newCompany.setLanguages(languageToSet);
                return res.status(200).send("Se creo, exitosamente la empresa");
            }

            else
                return res.status(400).send("nombre de empresa ya existe");


        } catch (error) {
            return res.status(500).send(error.message);
        }
};

const editCompany = async (req, res) => {
    const { businessName, activityType, startDate, fiscalAddress, legalRepresentative, contactData, bankAccount, nationalityId, userId, languages } = req.body;
    const { id } = req.params;
    if (id)
        try {
            const company = await Company.findByPk(id,
                {
                    where: {
                        state: true
                    }
                })
            if (company) {
                const response = {
                    business_name: businessName,
                    userId: userId,
                    activity_type: activityType,
                    start_date: startDate,
                    fiscal_address: fiscalAddress,
                    legal_representative: legalRepresentative,
                    data: contactData,
                    Bank_account: bankAccount,
                    id_nationality: nationalityId,
                };
                const update = await company.update(response);
                if (update) {
                    const languageToSet = await Language.findAll({
                        where: {
                            id: { [Op.in]: languages },
                        }
                    });
                    company.setLanguages(languageToSet);
                    return res.status(200).json(response);
                }
                else
                    return res.status(400).send("Error actualizando");
            }
            else
                return res.status(404).send("No se encontro empresa o esta borrada");
        } catch (error) {
            return res.status(500).send(error.message);
        }
    else
        return res.status(400).send("No se detecto id de empresa");

};

const deleteCompany = async (req, res) => {
    const { id } = req.params;
    if (id)
        try {
            const company = await Company.findByPk(id, {
                where: {
                    state: true
                }
            });
            if (company) {
                const response = await company.update({
                    ...company,
                    state: false
                });
                if (response)
                    return res.status(200).json(response);
                else
                    return res.status(400).send("Error eliminando la empresa");
            }
            else
                return res.status(404).send("Empresa no existe o esta borrada");
        } catch (error) {
            return res.status(500).send(error.message);
        }
    else
        return res.status(400).send("Error obteniendo el id");
};

module.exports = {
    getCompanies,
    getCompanyById,
    postCompany,
    editCompany,
    deleteCompany
};