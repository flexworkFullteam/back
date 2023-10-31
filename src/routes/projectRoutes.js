const express = require('express');
const router = express.Router();
const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getAllCompanyProjects,
    acceptedProyectProfessional,
    refuceProyectProfessional,
    getProfessionalPostulant,
    getProfessionalAccepted,
    getProfessionalRefused,
    finalizarProject
} = require('../controllers/projectController');

router.post('/project', createProject);

router.get("/projects/:id_company", getAllCompanyProjects);
router.get("/projects", getAllProjects);
router.get("/project/:id", getProjectById);
router.get("/project/:projectId/postulate", getProfessionalPostulant);
router.get("/project/:projectId/accepted", getProfessionalAccepted);
router.get("/project/:projectId/refuced", getProfessionalRefused);

router.put('/project/:projectId', updateProject);
router.put('/project/finish/:id', finalizarProject);
router.put('/project/:projectId/accepted/:professionalId', acceptedProyectProfessional);
router.put('/project/:projectId/refuced/:professionalId', refuceProyectProfessional);

router.delete('/project/:id', deleteProject);

module.exports = router;
