const express = require('express');
const router = express.Router();
const {
  getProfessionals,
  getProfessional,
  createProfessional,
  updateProfessional,
  deleteProfessional
} = require('../controllers/professionalController');

router.get('/', getProfessionals);
router.get('/:id', getProfessional);
router.post('/', createProfessional);
router.put('/:id', updateProfessional);
router.delete('/:id', deleteProfessional);

module.exports = router;