const { Professional } = require('../models/professional');

const getProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.findAll();
    res.json(professionals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfessional = async (req, res) => {
  const { id } = req.params;
  try {
    const professional = await Professional.findByPk(id);
    if (professional) {
      res.json(professional);
    } else {
      res.status(404).json({ error: 'No se encontro al Profesionista' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProfessional = async (req, res) => {
  try {
    const professional = await Professional.create(req.body);
    res.status(201).json(professional);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfessional = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Professional.update(req.body, {
      where: { id: id }
    });

    if (updated) {
      const updatedProfessional = await Professional.findByPk(id);
      res.json(updatedProfessional);
    } else {
      res.status(404).json({ error: 'No se encontro al Profesionista' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProfessional = async (req, res) => {
    const { id } = req.params;
    try {
      const professional = await Professional.findByPk(id);
      if (professional) {
        professional.state = false;
        await professional.save();
        res.status(200).json({ message: "Profesionista borrado" });
      } else {
        res.status(404).json({ error: 'Profesionista no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  

module.exports = {
  getProfessionals,
  getProfessional,
  createProfessional,
  updateProfessional,
  deleteProfessional
};