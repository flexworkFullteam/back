const express = require('express');
const router = express.Router();
const db = require('../models'); 


// Obtener todas las empresas
router.get('/', async (req, res) => {
    try {
        const companies = await db.Company.findAll();
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las empresas' });
    }
});

// Obtener una empresa por ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const company = await db.Company.findByPk(id);
        if (company) {
            res.json(company);
        } else {
            res.status(404).json({ error: 'Empresa no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la empresa' });
    }
});

// Agregar una nueva empresa
router.post('/', async (req, res) => {
    const {
        razon_Social,
        tipo_Actividad,
        fecha_Inicio,
        domicilio_Fiscal,
        representante_Legal,
        data,
        cuenta_Banco,
        state
    } = req.body;

    try {
        const newCompany = await db.Company.create({
            razon_Social,
            tipo_Actividad,
            fecha_Inicio,
            domicilio_Fiscal,
            representante_Legal,
            data,
            cuenta_Banco,
            state
        });
        res.json(newCompany);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar la empresa' });
    }
});

// Actualizar una empresa por ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const {
        razon_Social,
        tipo_Actividad,
        fecha_Inicio,
        domicilio_Fiscal,
        representante_Legal,
        data,
        cuenta_Banco,
        state
    } = req.body;

    try {
        const companyRecord = await db.Company.findByPk(id);
        if (companyRecord) {
            await companyRecord.update({
                razon_Social,
                tipo_Actividad,
                fecha_Inicio,
                domicilio_Fiscal,
                representante_Legal,
                data,
                cuenta_Banco,
                state
            });
            res.json({ message: 'Empresa actualizada exitosamente' });
        } else {
            res.status(404).json({ error: 'Empresa no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la empresa' });
    }
});

// Eliminar una empresa por ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const companyRecord = await db.Company.findByPk(id);
        if (companyRecord) {
            await companyRecord.destroy();
            res.json({ message: 'Empresa eliminada exitosamente' });
        } else {
            res.status(404).json({ error: 'Empresa no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la empresa' });
    }
});

module.exports = router;
