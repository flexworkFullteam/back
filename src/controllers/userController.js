const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const { User, Professional, Language, Nationality, Itskills, Company } = require('../DB_connection');
const dotenv = require('dotenv');
const transporter = require('../utils/emailConfig');
const { JWT_SECRET } = process.env;

dotenv.config({ path: '../.env' });
const saltRounds = 10;

const createUser = async (req, res) => {
    const { username, email, password, type } = req.body;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            type,
            emailToken: crypto.randomBytes(64).toString("hex")
        });
        /*const fromEmail = `"Fred Foo 👻" <${process.env.MAIL_USERNAME}>`;

        await transporter.sendMail({
            from: fromEmail, // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            html: "<b>Hello world?</b>", // html body

            //flexworks/verifi/128numeros
        });*/



        res.status(201).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al crear el usuario", error: error.message });
    }
};

const verifyemail = async (req, res) => {
    try {
        const { emailToken } = req.body;
        if (!emailToken) {
            return res.status(404).json( {message: "Error al validar el email"});
        }
        const user = await User.findOne({ where: { emailToken } });
        if (user) {
            user.emailToken =null;
            user.validate = true;
            await user.save()
            res.status(200).json({message: "Email verificado"});
        } else {
            res.status(404).json({message: "Invalid Token"});
        }

    } catch (error) {
        res.status(500).json(error.message);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let userMapped = {};
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send({ message: 'Usuario o contraseña incorrectos.' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ message: 'Usuario o contraseña incorrectos.' });
        }
        const token = jwt.sign({ userId: user.id, type: user.type }, JWT_SECRET, {
            expiresIn: '1h' // Sesion dura una hora, *investigar opciones de la duracion de la session (para siempre, por largo tiempo, o por actividad)
        });

        switch (user.type) {
            case 1: //admin

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
                        validate: user.validate,
                        email: user.email,
                        username: user.username,
                        type: user.type,
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
                    }
                } else {
                    userMapped = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        type: user.type,
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
                console.log(company);
                if (company) {
                    userMapped = {
                        id: user.id,
                        validate: user.validate,
                        email: user.email,
                        username: user.username,
                        type: user.type,
                        company_id: company.id,
                        businessName: company.business_name,
                        activityType: company.activity_type,
                        startDate: company.start_date,
                        fiscalAddress: company.fiscal_address,
                        legalRepresentative: company.legal_representative,
                        contactData: company.data,
                        bankAccount: company.Bank_account,
                        id_nationality: company.nationality.nationality, // Obtiene el nombre de la nacionalidad
                        languages: company.Languages.map(language => language.dataValues.language) // Obtiene los nombres de los idiomas
                    }
                } else {
                    userMapped = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        type: user.type,
                    }
                };
                break;

            default:
                break;
        }

        res.send({ token, userMapped });
    } catch (error) {
        res.status(500).send({ message: 'Error al iniciar sesión.', error: error ? error.message : 'No se proporciona mensaje de error.' });

    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update(req.body);
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            user.state = false;
            await user.save();

            res.status(204).send("Se borro el usuario");

        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario", error });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    login,
    verifyemail
};