const { ExperienceLevel } = require('../DB_connection');
const textRegex = /^[A-Za-záéíóúñÁÉÍÓÚ+#]+([- ][A-Za-záéíóúñÁÉÍÓÚ+#]+)*$/;

const DB = ExperienceLevel;
const fieldName = "experienceLevel";
const text = "Experince Level";

const getAll = async (req, res) => {
    try {
        //console.log("test");
        const response = await DB.findAll({
            where: { state: true },
            attributes: ['id', fieldName],
        });

        if (response.length === 0) {
            return res.status(404).json({ message: "No records found" });
        }

        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const post = async (req, res) => {
    let { new_resource } = req.body;
        try {
            const errors = [];
            //console.log(new_resource);
            new_resource = new_resource.trim();
            new_resource = new_resource.charAt(0).toUpperCase() + new_resource.slice(1).toLowerCase();

            const existing = await DB.findOne({
                where: {
                    [fieldName]: new_resource
                }
            });

            if (!textRegex.test(new_resource)) {
                errors.push('Invalid format');
            }

            if (existing) {
                errors.push(`That ${text} already exists in the system`);
            }


            if (errors.length > 0) {
                res.status(400).json({ message: errors });
                return;
            }

            const newResource = await DB.create({
                [fieldName]: new_resource
            });

            res.status(200).json({ message: `${text} successfully registered`, newResource });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
};
const delet = async (req, res) => {
    try {
        const id = req.params.id;
        const target = await DB.findByPk(id);
        if (!target) {
            return res.status(404).json({ message: `${text} not found` });
        }
        target.state = false;
        await target.save();
        res.status(200).json({ message: `${text} successfully removed` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    getAll,
    post,
    delet
};