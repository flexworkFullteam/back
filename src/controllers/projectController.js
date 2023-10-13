const { Project } = require('../DB_connection');

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
        const projects = await Project.findAll();
        if (projects.length === 0) {
            return res.status(500).json({ message: "Error al obtener los proyectos" })
        }
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los proyectos", error : error.message});
    }
};

// Obtener un proyecto por ID
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            res.status(200).json(project);
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
