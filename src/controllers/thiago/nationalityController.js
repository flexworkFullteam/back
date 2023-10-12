const express = require('express');
const router = express.Router();
const db = require('../models'); 

// Obtener todas las nacionalidades
router.get('/', async (req, res) => {
    try {
        const nationalities = await db.Nationality.findAll();
        res.json(nationalities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las nacionalidades' });
    }
});

// Obtener una nacionalidad por ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const nationality = await db.Nationality.findByPk(id);
        if (nationality) {
            res.json(nationality);
        } else {
            res.status(404).json({ error: 'Nacionalidad no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la nacionalidad' });
    }
});

// Agregar una nueva nacionalidad
router.post('/', async (req, res) => {
    const { nationality, state } = req.body;

    try {
        const newNationality = await db.Nationality.create({ nationality, state });
        res.json(newNationality);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar la nacionalidad' });
    }
});

// Actualizar una nacionalidad por ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { nationality, state } = req.body;

    try {
        const nationalityRecord = await db.Nationality.findByPk(id);
        if (nationalityRecord) {
            await nationalityRecord.update({ nationality, state });
            res.json({ message: 'Nacionalidad actualizada exitosamente' });
        } else {
            res.status(404).json({ error: 'Nacionalidad no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la nacionalidad' });
    }
});

// Eliminar una nacionalidad por ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const nationalityRecord = await db.Nationality.findByPk(id);
        if (nationalityRecord) {
            await nationalityRecord.destroy();
            res.json({ message: 'Nacionalidad eliminada exitosamente' });
        } else {
            res.status(404).json({ error: 'Nacionalidad no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la nacionalidad' });
    }
});

module.exports = router;
