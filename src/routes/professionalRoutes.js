const express = require('express');
const router = express.Router();
const {
  getProfessionals,
  getProfessional,
  createProfessional,
  updateProfessional,
  deleteProfessional
} = require('../controllers/professionalController');

 //Jonnathan2
router.get('/uProf', getProfessionals);
router.get('/uProf/:id', getProfessional);
router.post('/uProf', createProfessional);
router.put('/uProf/:id', updateProfessional);
router.delete('/uProf/:id', deleteProfessional);

//development
router.get('/professional', getProfessionals);
router.get('/professional/:id', getProfessional);
router.post('/professional', createProfessional);
router.put('/professional/:id', updateProfessional);
router.delete('/professional/:id', deleteProfessional);


module.exports = router;