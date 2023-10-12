const express = require('express');
const router = express.Router();
const db = require('../models');

// Obtener todos las lenguajes
router.get('/', async (req, res) => {
    try {
        const languages = await db.Language.findAll();
        res.json(languages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los lenguajes' });
    }
});

// Obtener un lenguaje por ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const language = await db.Language.findByPk(id);
        if (language) {
            res.json(language);
        } else {
            res.status(404).json({ error: 'Lenguaje no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el lenguaje' });
    }
});

// Agregar un nuevo lenguaje
router.post('/', async (req, res) => {
    const { language, state } = req.body;

    try {
        const newLanguage = await db.Language.create({ language, state });
        res.json(newLanguage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el lenguaje' });
    }
});

// Actualizar un lenguaje por ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { language, state } = req.body;

    try {
        const languageRecord = await db.Language.findByPk(id);
        if (languageRecord) {
            await languageRecord.update({ language, state });
            res.json({ message: 'Lenguaje actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Lenguaje no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el lenguaje' });
    }
});

// Eliminar un lenguaje por ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const languageRecord = await db.Language.findByPk(id);
        if (languageRecord) {
            await languageRecord.destroy();
            res.json({ message: 'Lenguaje eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Lenguaje no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el lenguaje' });
    }
});

module.exports = router;
