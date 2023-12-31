const { Admin, User, Company, Professional } = require("../DB_connection");

const getAdminById = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Admin.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'usuario', // El alias que especificaste en la relación
                    attributes: ['username'], // Las columnas que quieres obtener
                },
            ],
        });
        if (admin) {
            return res.status(200).json(admin);
        } else {
            return res.status(404).json({ error: "No se encontro el usuario" }); // Admin no encontrado
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

};

const postAdmin = async (req, res) => {

    const { user_id } = req.body;
    try {
        const [newAdmin, created] = await Admin.findOrCreate({
            where: { user_id }
        });
        ////console.log(newAdmin);
        if (created)
            return res.status(200).json(newAdmin);
        return res.status(400).send("Error al crear usuario, ya existe");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const validateuser = async (req, res) => {
    try {
        const id = req.params.id;

        let user = await Company.findByPk(id);

        if (!user) {
            // Si no se encontró en Company, intentar en Professional
            user = await Professional.findByPk(id);
        }

        if (user) {
            if (user.valid === false) {
                user.valid = true;
            } else {
                user.valid = false;
            }

            await user.save();
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al validar el Usuario", error });
    }
};


module.exports = {
    getAdminById,
    postAdmin,
    validateuser
};