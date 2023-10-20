const express = require('express');
const router = express.Router();
const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    acceptedProyectProfessional,
    refuceProyectProfessional,
    getProfessionalPostulant,
    getProfessionalAccepted,
    getProfessionalRefused
} = require('../controllers/projectController');

router.post('/project', createProject);

router.get('/projects', getAllProjects);
router.get('/project/:id', getProjectById);
router.get('/project/:projectId/postulate', getProfessionalPostulant);
router.get('/project/:projectId/accepted', getProfessionalAccepted);
router.get('/project/:projectId/refuced', getProfessionalRefused);

router.put('/project/:id', updateProject);
router.put('/project/:projectId/accepted/:professionalId', acceptedProyectProfessional);
router.put('/project/:projectId/refuced/:professionalId', refuceProyectProfessional);

router.delete('/project/:id', deleteProject);

module.exports = router;
