const express = require('express');
const router = express.Router();
const db = require('../models'); 

// Obtener todos los tipos de proyecto
router.get('/', async (req, res) => {
    try {
        const projectTypes = await db.ProjectType.findAll();
        res.json(projectTypes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los tipos de proyecto' });
    }
});

// Obtener un tipo de proyecto por ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const projectType = await db.ProjectType.findByPk(id);
        if (projectType) {
            res.json(projectType);
        } else {
            res.status(404).json({ error: 'Tipo de proyecto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el tipo de proyecto' });
    }
});

// Agregar un nuevo tipo de proyecto
router.post('/', async (req, res) => {
    const { project_type, state } = req.body;

    try {
        const newProjectType = await db.ProjectType.create({ project_type, state });
        res.json(newProjectType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el tipo de proyecto' });
    }
});

// Actualizar un tipo de proyecto por ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { project_type, state } = req.body;

    try {
        const projectTypeRecord = await db.ProjectType.findByPk(id);
        if (projectTypeRecord) {
            await projectTypeRecord.update({ project_type, state });
            res.json({ message: 'Tipo de proyecto actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Tipo de proyecto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el tipo de proyecto' });
    }
});

// Eliminar un tipo de proyecto por ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const projectTypeRecord = await db.ProjectType.findByPk(id);
        if (projectTypeRecord) {
            await projectTypeRecord.destroy();
            res.json({ message: 'Tipo de proyecto eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Tipo de proyecto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el tipo de proyecto' });
    }
});

module.exports = router;
