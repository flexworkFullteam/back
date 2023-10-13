const { Router } = require('express')
const router = Router();
const language = require('../controllers/languageController');

router.get("/language", language.getAll);
router.post("/language", language.post);
router.delete("/language/:id", language.delet);

module.exports = router;