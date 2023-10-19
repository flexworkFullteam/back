const express = require('express');
const router = express.Router();
const {
  getProfessionals,
  getProfessional,
  createProfessional,
  updateProfessional,
  deleteProfessional,
  addSkillOrLanguageToProfessional,
  removeSkillOrLanguageFromProfessional
} = require('../controllers/professionalController');


router.get('/professional', getProfessionals);
router.get('/professional/:id', getProfessional);
router.post('/professional', createProfessional);
router.put('/professional/:id', updateProfessional);
router.delete('/professional/:id', deleteProfessional);
router.delete('/professional/:id/:type/:itemId', removeSkillOrLanguageFromProfessional);
router.post('/professional/:id/:type/:itemId', addSkillOrLanguageToProfessional);

module.exports = router;