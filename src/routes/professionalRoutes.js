const express = require('express');
const router = express.Router();
const {
  getProfessionals,
  getProfessional,
  createProfessional,
  updateProfessional,
  deleteProfessional,
  addSkillOrLanguageToProfessional,
  removeSkillOrLanguageFromProfessional,
  addProyectProfessional
} = require('../controllers/professionalController');


router.get('/professional', getProfessionals);
router.get('/professional/:id', getProfessional);

router.post('/professional', createProfessional);
router.post('/professional/:id/:type/:itemId', addSkillOrLanguageToProfessional);

router.put('/professional/:id', updateProfessional);
router.put('/professional/:professionalId/:projectId', addProyectProfessional);

router.delete('/professional/:id', deleteProfessional);
router.delete('/professional/:id/:type/:itemId', removeSkillOrLanguageFromProfessional);

module.exports = router;