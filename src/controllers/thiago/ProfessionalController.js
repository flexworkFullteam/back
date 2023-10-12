const express = require('express');
const router = express.Router();
const db = require('../models'); 

// Obtener todos los profesionales
router.get('/', async (req, res) => {
    try {
        const professionals = await db.Professional.findAll();
        res.json(professionals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los profesionales' });
    }
});

// Obtener un profesional por ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const professional = await db.Professional.findByPk(id);
        if (professional) {
            res.json(professional);
        } else {
            res.status(404).json({ error: 'Profesional no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el profesional' });
    }
});

// Agregar un nuevo profesional
router.post('/', async (req, res) => {
    const {
        data,
        experience,
        education,
        languages,
        nationality,
        development_skills,
        extra_information,
        briefcase,
        cci,
        state
    } = req.body;

    try {
        const newProfessional = await db.Professional.create({
            data,
            experience,
            education,
            languages,
            nationality,
            development_skills,
            extra_information,
            briefcase,
            cci,
            state
        });
        res.json(newProfessional);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el profesional' });
    }
});

// Actualizar un profesional por ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const {
        data,
        experience,
        education,
        languages,
        nationality,
        development_skills,
        extra_information,
        briefcase,
        cci,
        state
    } = req.body;

    try {
        const professionalRecord = await db.Professional.findByPk(id);
        if (professionalRecord) {
            await professionalRecord.update({
                data,
                experience,
                education,
                languages,
                nationality,
                development_skills,
                extra_information,
                briefcase,
                cci,
                state
            });
            res.json({ message: 'Profesional actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Profesional no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el profesional' });
    }
});

// Eliminar un profesional por ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const professionalRecord = await db.Professional.findByPk(id);
        if (professionalRecord) {
            await professionalRecord.destroy();
            res.json({ message: 'Profesional eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Profesional no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el profesional' });
    }
});

module.exports = router;
