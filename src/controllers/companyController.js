const { Company } = require("../DB_connection");
const { User, Nationality, Language } = require("../DB_connection");
const { Op } = require("sequelize");
const { getDatefromDate } = require("../utils/validations");

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
                    ruc: company.ruc,
                    legalRepresentative: company.legal_representative,
                    contactData: company.data,
                    bankAccount: company.Bank_account,
                    createdAt: company.createdAt,
                    image: company.image,
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
                    ruc: company.ruc,
                    legalRepresentative: company.legal_representative,
                    contactData: company.data,
                    bankAccount: company.Bank_account,
                    createdAt: company.createdAt,
                    image: company.image,
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
    const fieldRegex = /^[^\n\r\t\v\f\p{P}]{5,}$/u; //   Esto asegurará que la cadena cumpla con la longitud mínima de 5 caracteres y no contenga signos de puntuación.
    const dateRegex = /^\d{2}\s*-\s*\d{2}\s*-\s*\d{4}$/;  // MM-DD-YYYY
    const rucRegex = /^[0-9]{11}$/;
    const bankRegex = /^[0-9]+$/;
    //const arrayEnterosRegex = /^\[\s*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}(?:,\s*)?)+\s*\]$/;
    const linkRegex = /^https?:\/\/(?:www\.)?[\w\.-]+\.\w{2,}(?:\/\S*)?$/;
    //const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    const { businessName, activityType, startDate, fiscalAddress, ruc, legalRepresentative, data, bankAccount, nationalityId, userId, languages, imagen } = req.body;

    if (fieldRegex.test(businessName) && fieldRegex.test(activityType) && dateRegex.test(getDatefromDate(new Date(startDate))) && fieldRegex.test(fiscalAddress) && rucRegex.test(ruc) && fieldRegex.test(legalRepresentative) && typeof data === "object" && data !== null && bankRegex.test(bankAccount) && linkRegex.test(imagen))
        try {
            const [newCompany, created] = await Company.findOrCreate(
                {
                    where: { business_name: businessName },
                    defaults: {
                        userId: userId,
                        activity_type: activityType,
                        start_date: new Date(startDate),
                        fiscal_address: fiscalAddress,
                        legal_representative: legalRepresentative,
                        data: data,
                        Bank_account: bankAccount,
                        id_nationality: nationalityId,
                        image: imagen,
                        ruc
                    }
                })
            if (created) {
                const languageToSet = await Language.findAll({
                    where: {
                        id: { [Op.in]: languages },
                    }
                });
                await newCompany.setLanguages(languageToSet);
                return res.status(200).send("Se creo, exitosamente la empresa");
            }

            else
                return res.status(400).send("nombre de empresa ya existe");


        } catch (error) {
            return res.status(500).send(error.message);
        }
    return res.status(400).send("error de validacion de datos, verifica los campos y sus tipos.");
};

const editCompany = async (req, res) => {
    const { businessName, activityType, startDate, fiscalAddress, ruc, legalRepresentative, data, bankAccount, nationalityId, userId, languages, imagen } = req.body;

    const { id } = req.params;
    const fieldRegex = /^[^\n\r\t\v\f\p{P}]{5,}$/u; //   Esto asegurará que la cadena cumpla con la longitud mínima de 5 caracteres y no contenga signos de puntuación.
    const dateRegex = /^\d{2}\s*-\s*\d{2}\s*-\s*\d{4}$/;  // MM-DD-YYYY
    const rucRegex = /^[0-9]{11}$/;
    const bankRegex = /^[0-9]+$/;
    //const arrayEnterosRegex = /^\[?(-?\d+(, ?-?\d+)*)\]?/;
    const linkRegex = /^https?:\/\/(?:www\.)?[\w\.-]+\.\w{2,}(?:\/\S*)?$/;
    //const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (fieldRegex.test(businessName) && fieldRegex.test(activityType) && dateRegex.test(getDatefromDate(new Date(startDate))) && fieldRegex.test(fiscalAddress) && rucRegex.test(ruc) && fieldRegex.test(legalRepresentative) && typeof data === "object" && data !== null && bankRegex.test(bankAccount) && linkRegex.test(imagen))
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
                        ruc,
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