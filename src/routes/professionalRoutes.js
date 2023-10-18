const express = require('express');
const router = express.Router();
const {
  getProfessionals,
  getProfessional,
  createProfessional,
  updateProfessional,
  deleteProfessional
} = require('../controllers/professionalController');


router.get('/uProf', getProfessionals);
router.get('/uProf/:id', getProfessional);
router.post('/uProf', createProfessional);
router.put('/uProf/:id', updateProfessional);
router.delete('/uProf/:id', deleteProfessional);


module.exports = router;