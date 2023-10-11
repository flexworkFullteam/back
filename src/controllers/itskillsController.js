const express = require('express');
const router = express.Router();
const db = require('../models'); 

// Obtener todas las habilidades IT
router.get('/', async (req, res) => {
    try {
        const skills = await db.itskills.findAll();
        res.json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las habilidades IT' });
    }
});

// Obtener una habilidad IT por ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const skill = await db.itskills.findByPk(id);
        if (skill) {
            res.json(skill);
        } else {
            res.status(404).json({ error: 'Habilidad IT no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la habilidad IT' });
    }
});

// Agregar una nueva habilidad IT
router.post('/', async (req, res) => {
    const { it_skill, state } = req.body;

    try {
        const newSkill = await db.itskills.create({ it_skill, state });
        res.json(newSkill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar la habilidad IT' });
    }
});

// Actualizar una habilidad IT por ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { it_skill, state } = req.body;

    try {
        const skill = await db.itskills.findByPk(id);
        if (skill) {
            await skill.update({ it_skill, state });
            res.json({ message: 'Habilidad IT actualizada exitosamente' });
        } else {
            res.status(404).json({ error: 'Habilidad IT no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la habilidad IT' });
    }
});

// Eliminar una habilidad IT por ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const skill = await db.itskills.findByPk(id);
        if (skill) {
            await skill.destroy();
            res.json({ message: 'Habilidad IT eliminada exitosamente' });
        } else {
            res.status(404).json({ error: 'Habilidad IT no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la habilidad IT' });
    }
});

module.exports = router;
