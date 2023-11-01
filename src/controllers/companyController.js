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
                    id: company.id, // Obtiene id
                    valid: company.valid,
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
                    valid: company.valid,
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
    const fieldRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s.,'()-]{5,}$/u; //   Esto asegurará que la cadena cumpla con la longitud mínima de 5 caracteres y no contenga signos de puntuación.
    const { businessName, activityType, startDate, fiscalAddress, ruc, legalRepresentative, data, bankAccount, nationalityId, userId, languages, imagen } = req.body;

    if (fieldRegex.test(businessName))
        try {
            const userparam = await User.findByPk(userId);
            if (userparam.type === 3) {
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
                            ruc: ruc
                        }
                    })
                if (created) {
                    const languageToSet = await Language.findAll({
                        where: {
                            id: { [Op.in]: languages },
                        }
                    });
                    await newCompany.setLanguages(languageToSet);
                    const company = await Company.findOne({
                        where: { userId: userId },
                        include: [
                            { model: Nationality, as: 'nationality' }, // Relación con el modelo Nationality (id_nationality)
                            {
                                model: Language,
                                as: "Languages",
                                attributes: ['language'], // Puedes especificar las columnas que deseas seleccionar
                                through: { attributes: [] } // Excluye las columnas de la tabla intermedia si no las necesitas
                            }
                        ]
                    })
                    return res.status(200).json({ company });
                } else {
                    return res.status(400).send("nombre de empresa ya existe");
                }
            } else {
                res.status(404).json({ message: "Usuario no valido" });
            }
        } catch (error) {
            return res.status(500).send(error.message);
        }
    return res.status(400).send("error de validacion de datos, verifica los campos y sus tipos.");
};

const editCompany = async (req, res) => {
    const { businessName, activityType, startDate, fiscalAddress, ruc, legalRepresentative, data, bankAccount, nationalityId, userId, languages, imagen } = req.body;

    const { id } = req.params;
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
                ruc: ruc,
                fiscal_address: fiscalAddress,
                legal_representative: legalRepresentative,
                data: data,
                Bank_account: bankAccount,
                id_nationality: nationalityId,
                imagen: imagen
            };
            const update = await company.update(response);
            if (update) {
                const languageIds = Array.isArray(languages) ? languages : [languages];
                const languagePromises = languageIds.map(async (languageId) => {
                    const language = await Language.findByPk(languageId);
                    return language;
                });
                const resolvedLanguages = await Promise.all(languagePromises);
                const validLanguages = resolvedLanguages.filter((language) => language !== null);
                await update.setLanguages(validLanguages);
                return res.status(200).json(response);
            }
            else
                return res.status(400).send("Error actualizando");
        }
        else
            return res.status(404).send("No se encontro empresa o esta borrada");
    } catch (error) {
        ////console.log(businessName);
        return res.status(500).send(error.message);
    }

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