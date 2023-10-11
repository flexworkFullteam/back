const express = require('express');
const router = express.Router();
const db = require('../models');

// Obtener todas las reseñas
router.get('/', async (req, res) => {
    try {
        const reviews = await db.Review.findAll();
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las reseñas' });
    }
});

// Obtener una reseña por ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const review = await db.Review.findByPk(id);
        if (review) {
            res.json(review);
        } else {
            res.status(404).json({ error: 'Reseña no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la reseña' });
    }
});

// Agregar una nueva reseña
router.post('/', async (req, res) => {
    const { value, description, state, userId } = req.body;

    try {
        const newReview = await db.Review.create({
            value,
            description,
            state,
            userId
        });
        res.json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar la reseña' });
    }
});

// Actualizar una reseña por ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { value, description, state, userId } = req.body;

    try {
        const reviewRecord = await db.Review.findByPk(id);
        if (reviewRecord) {
            await reviewRecord.update({
                value,
                description,
                state,
                userId
            });
            res.json({ message: 'Reseña actualizada exitosamente' });
        } else {
            res.status(404).json({ error: 'Reseña no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la reseña' });
    }
});

// Eliminar una reseña por ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const reviewRecord = await db.Review.findByPk(id);
        if (reviewRecord) {
            await reviewRecord.destroy();
            res.json({ message: 'Reseña eliminada exitosamente' });
        } else {
            res.status(404).json({ error: 'Reseña no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la reseña' });
    }
});

module.exports = router;
