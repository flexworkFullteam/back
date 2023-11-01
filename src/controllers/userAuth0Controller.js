require("dotenv").config();
const { User, Professional, Language, Nationality, Itskills, Company } = require('../DB_connection');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { JWT_SECRET } = process.env;

const userAuth0Controller = {};

userAuth0Controller.loginOrSignup = async (req, res) => {
    try {
        //console.log("Received email and auth0Id: ", req.email, req.auth0Id);
        // Extract email and Auth0 ID from the request
        const email = req.email;
        const auth0Id = req.auth0Id;
        // Try to find a user with the provided email
        let user = await User.findOne({
            where: {
                email: email,
            }
        });
        // If no user exists with the provided email, create a new user
        if (!user) {
            // Generating a temporary password for placeholder
            const temporaryPassword = crypto.randomBytes(10).toString('hex');
            user = await User.create({
                username: email,
                email: email,
                password: temporaryPassword,  // Saving a hashed password should be considered
                auth0Id: auth0Id,
                type: 4,
                valid: true
                // Additional fields should be included if necessary
            });
            // Generating a JWT token for the new user
            const token = jwt.sign({ userId: user.id, email: user.email, type: user.type }, JWT_SECRET, {
                expiresIn: '3h'
            });
            // Sending the token and user details as a response
            return res.status(201).json({ message: 'Placeholder account created', token, user });
        }
        // If the Auth0 ID matches with the one in the database, log the user in
        if (user.auth0Id === auth0Id) {
            // Generating a JWT token for the logged-in user
            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
                expiresIn: '3h'
            });
            switch (user.type) {
                case 1: //admin
                    userMapped = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        type: user.type,
                        valid: user.valid,
                        auth0Id: user.auth0Id
                    }
                    break;
                case 2: //profecional
    
                    const professional = await Professional.findOne({
                        where: { userId: user.id }
                    });
    
                    if (professional) {
    
                        const languages = await Language.findAll({ attributes: ['id', 'language'] });
                        const nationality = await Nationality.findAll({ attributes: ['id', 'nationality'] });
                        const itskills = await Itskills.findAll({ attributes: ['id', 'it_skill'] });
    
                        const languagesMap = new Map(languages.map((lang) => [lang.id, lang.language]));
                        const nationalityMap = new Map(nationality.map((national) => [national.id, national.nationality]));
                        const itskillsMap = new Map(itskills.map((it) => [it.id, it.it_skill]));
    
                        // Obten las habilidades del profesional a través de la tabla intermedia
                        const professionalItskills = await professional.getItskills();
                        // Obten los idiomas del profesional a través de la tabla intermedia
                        const professionalLanguages = await professional.getLanguages();
    
                        const professionalSkills = professionalItskills.map((skill) => itskillsMap.get(skill.id));
                        const professionalLang = professionalLanguages.map((language) => languagesMap.get(language.id));
    
                        userMapped = {
                            id: user.id,
                            valid: user.valid,
                            email: user.email,
                            username: user.username,
                            type: user.type,
                            auth0Id: user.auth0Id,
                            professional_id: professional.id,
                            nationality: nationalityMap.get(professional.id_nationality),
                            data: professional.data,
                            experience: professional.experience,
                            education: professional.education,
                            extra_information: professional.extra_information,
                            portfolio: professional.portfolio,
                            cci: professional.cci,
                            itskills: professionalSkills,
                            languages: professionalLang,
                            image: professional.image,
                            typevalid: professional.valid
                        }
                    } else {
                        userMapped = {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            type: user.type,
                            valid: user.valid
                        }
                    };
                    break;
                case 3: //empresa
                    const company = await Company.findOne({
                        where: { userId: user.id },
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
                    //console.log(company);
                    if (company) {
                        userMapped = {
                            id: user.id,
                            valid: user.valid,
                            email: user.email,
                            username: user.username,
                            type: user.type,
                            auth0Id: user.auth0Id,
                            company_id: company.id,
                            businessName: company.business_name,
                            activityType: company.activity_type,
                            startDate: company.start_date,
                            fiscalAddress: company.fiscal_address,
                            legalRepresentative: company.legal_representative,
                            image: company.image,
                            contactData: company.data,
                            bankAccount: company.Bank_account,
                            ruc: company.ruc,
                            id_nationality: company.nationality.nationality, // Obtiene el nombre de la nacionalidad
                            languages: company.Languages.map(language => language.dataValues.language), // Obtiene los nombres de los idiomas
                            typevalid: company.valid
                        }
                    } else {
                        userMapped = {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            type: user.type,
                            valid: user.valid
                        }
                    };
                    break;
                default:
                    userMapped = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        type: user.type,
                        auth0Id: user.auth0Id,
                        valid: user.valid
                    }
                    break;
            }
            user = userMapped;
            // Sending the token and user details as a response
            return res.status(200).json({ message: 'Logged in using Auth0', token, user });
        }
        // If user found but Auth0 ID is not set, update the Auth0 ID
        else if (user.auth0Id === null) {
            user.valid = true;
            user.auth0Id = auth0Id;
            await user.save();

            // Generating a JWT token for the user after updating Auth0 ID
            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
                expiresIn: '3h'
            });
            switch (user.type) {
                case 1: //admin
                    userMapped = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        type: user.type,
                        valid: user.valid,
                        auth0Id: user.auth0Id
                    }
                    break;
                case 2: //profecional
    
                    const professional = await Professional.findOne({
                        where: { userId: user.id }
                    });
    
                    if (professional) {
    
                        const languages = await Language.findAll({ attributes: ['id', 'language'] });
                        const nationality = await Nationality.findAll({ attributes: ['id', 'nationality'] });
                        const itskills = await Itskills.findAll({ attributes: ['id', 'it_skill'] });
    
                        const languagesMap = new Map(languages.map((lang) => [lang.id, lang.language]));
                        const nationalityMap = new Map(nationality.map((national) => [national.id, national.nationality]));
                        const itskillsMap = new Map(itskills.map((it) => [it.id, it.it_skill]));
    
                        // Obten las habilidades del profesional a través de la tabla intermedia
                        const professionalItskills = await professional.getItskills();
                        // Obten los idiomas del profesional a través de la tabla intermedia
                        const professionalLanguages = await professional.getLanguages();
    
                        const professionalSkills = professionalItskills.map((skill) => itskillsMap.get(skill.id));
                        const professionalLang = professionalLanguages.map((language) => languagesMap.get(language.id));
    
                        userMapped = {
                            id: user.id,
                            valid: user.valid,
                            email: user.email,
                            username: user.username,
                            type: user.type,
                            auth0Id: user.auth0Id,
                            professional_id: professional.id,
                            nationality: nationalityMap.get(professional.id_nationality),
                            data: professional.data,
                            experience: professional.experience,
                            education: professional.education,
                            extra_information: professional.extra_information,
                            portfolio: professional.portfolio,
                            cci: professional.cci,
                            itskills: professionalSkills,
                            languages: professionalLang,
                            image: professional.image,
                            typevalid: professional.valid
                        }
                    } else {
                        userMapped = {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            type: user.type,
                            valid: user.valid
                        }
                    };
                    break;
                case 3: //empresa
                    const company = await Company.findOne({
                        where: { userId: user.id },
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
                    //console.log(company);
                    if (company) {
                        userMapped = {
                            id: user.id,
                            valid: user.valid,
                            email: user.email,
                            username: user.username,
                            type: user.type,
                            auth0Id: user.auth0Id,
                            company_id: company.id,
                            businessName: company.business_name,
                            activityType: company.activity_type,
                            startDate: company.start_date,
                            fiscalAddress: company.fiscal_address,
                            legalRepresentative: company.legal_representative,
                            image: company.image,
                            contactData: company.data,
                            bankAccount: company.Bank_account,
                            ruc: company.ruc,
                            id_nationality: company.nationality.nationality, // Obtiene el nombre de la nacionalidad
                            languages: company.Languages.map(language => language.dataValues.language), // Obtiene los nombres de los idiomas
                            typevalid: company.valid
                        }
                    } else {
                        userMapped = {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            type: user.type,
                            valid: user.valid
                        }
                    };
                    break;
                default:
                    userMapped = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        type: user.type,
                        auth0Id: user.auth0Id,
                        valid: user.valid
                    }
                    break;
            }
            user = userMapped;
            // Sending the token and user details as a response
            return res.status(200).json({ message: 'Auth0 ID added to existing user', token, user });
        }
        // If Auth0 IDs mismatch, send an error message
        else {
            return res.status(400).json({ message: 'Mismatch in Auth0 ID' });
        }
    } catch (error) {
        // In case of an error, send an error message as a response
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = userAuth0Controller;

