const express = require('express');
const router = express.Router();
const db = require('../models');

// Obtener todas las ubicaciones
router.get('/', async (req, res) => {
    try {
        const locations = await db.Location.findAll();
        res.json(locations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las ubicaciones' });
    }
});

// Obtener una ubicación por ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const location = await db.Location.findByPk(id);
        if (location) {
            res.json(location);
        } else {
            res.status(404).json({ error: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la ubicación' });
    }
});

// Agregar una nueva ubicación
router.post('/', async (req, res) => {
    const { location, state } = req.body;

    try {
        const newLocation = await db.Location.create({ location, state });
        res.json(newLocation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar la ubicación' });
    }
});

// Actualizar una ubicación por ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { location, state } = req.body;

    try {
        const locationRecord = await db.Location.findByPk(id);
        if (locationRecord) {
            await locationRecord.update({ location, state });
            res.json({ message: 'Ubicación actualizada exitosamente' });
        } else {
            res.status(404).json({ error: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la ubicación' });
    }
});

// Eliminar una ubicación por ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const locationRecord = await db.Location.findByPk(id);
        if (locationRecord) {
            await locationRecord.destroy();
            res.json({ message: 'Ubicación eliminada exitosamente' });
        } else {
            res.status(404).json({ error: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la ubicación' });
    }
});

module.exports = router;
