const { Project, Company, ProjectType, ProjectFields, ExperienceLevel } = require('../DB_connection');

// Crear un proyecto
const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el proyecto", error });
    }
};

// Obtener todos los proyectos
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            attributes: ['id', 'title', 'id_company', 'description', 'field', 'type', 'salary', 'exp_req', 'lapse'],
        });

        if (projects.length === 0) {
            return res.status(500).json({ message: "Error al obtener los proyectos" });
        }

        // Obtén la información adicional de las tablas relacionadas
        const companys = await Company.findAll({ attributes: ['id', 'business_name'] });
        const projectType = await ProjectType.findAll({ attributes: ['id', 'project_type'] });
        const projectFields = await ProjectFields.findAll({ attributes: ['id', 'project_fields'] });
        const experienceLevel = await ExperienceLevel.findAll({ attributes: ['id', 'experienceLevel'] });

        // Crea mapas para mapear IDs a strings correspondientes
        const companysMap = new Map(companys.map((company) => [company.id, company.business_name]));
        const projectTypeMap = new Map(projectType.map((type) => [type.id, type.project_type]));
        const projectFieldsMap = new Map(projectFields.map((field) => [field.id, field.project_fields]));
        const experienceLevelMap = new Map(experienceLevel.map((level) => [level.id, level.experienceLevel]));

        // Mapea los IDs de proyectos a sus correspondientes strings
        const projectsWithMappedData = projects.map((project) => ({
            id: project.id,
            title: project.title,
            id_company: companysMap.get(project.id_company),
            description: project.description,
            field: projectFieldsMap.get(project.field),
            type: projectTypeMap.get(project.type),
            salary: project.salary,
            exp_req: experienceLevelMap.get(project.exp_req),
            lapse: project.lapse,
        }));
        console.log(projectsWithMappedData);
        res.status(200).json(projectsWithMappedData);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los proyectos", error: error.message });
    }
};



// Obtener un proyecto por ID
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);

        if (project) {
            // Obtén información adicional de las tablas relacionadas
            const companys = await Company.findAll({ attributes: ['id', 'business_name'] });
            const projectType = await ProjectType.findAll({ attributes: ['id', 'project_type'] });
            const projectFields = await ProjectFields.findAll({ attributes: ['id', 'project_fields'] });
            const experienceLevel = await ExperienceLevel.findAll({ attributes: ['id', 'experienceLevel'] });

            // Crea mapas para mapear IDs a strings correspondientes
            const companysMap = new Map(companys.map((company) => [company.id, company.business_name]));
            const projectTypeMap = new Map(projectType.map((type) => [type.id, type.project_type]));
            const projectFieldsMap = new Map(projectFields.map((field) => [field.id, field.project_fields]));
            const experienceLevelMap = new Map(experienceLevel.map((level) => [level.id, level.experienceLevel]));

            // Mapea los IDs del proyecto a sus correspondientes strings
            const projectWithMappedData = {
                id: project.id,
                title: project.title,
                id_company: companysMap.get(project.id_company),
                description: project.description,
                field: projectFieldsMap.get(project.field),
                type: projectTypeMap.get(project.type),
                salary: project.salary,
                exp_req: experienceLevelMap.get(project.exp_req),
                lapse: project.lapse,
            };

            res.status(200).json(projectWithMappedData);
        } else {
            res.status(404).json({ message: "Proyecto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el proyecto", error });
    }
};


// Actualizar un proyecto
const updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            await project.update(req.body);
            res.status(200).json(project);
        } else {
            res.status(404).json({ message: "Proyecto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el proyecto", error });
    }
};

// Borrado lógico de un proyecto
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            project.state = false;
            await project.save();
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Proyecto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al borrar el proyecto", error });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};
