const express = require('express');
const router = express.Router();
const {
  getProfessionals,
  getProfessional,
  createProfessional,
  updateProfessional,
  deleteProfessional
} = require('../controllers/professionalController');

router.get('/professional', getProfessionals);
router.get('/professional/:id', getProfessional);
router.post('/professional', createProfessional);
router.put('/professional/:id', updateProfessional);
router.delete('/professional/:id', deleteProfessional);

module.exports = router;