const { Router } = require('express')
const router = Router();
const experienceLevel = require('../controllers/experienceLevelController');

router.get("/experiencelevel", experienceLevel.getAll);
router.post("/experiencelevel", experienceLevel.post);
router.delete("/experiencelevel/:id", experienceLevel.delet);

module.exports = router;