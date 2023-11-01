const { Router } = require('express')
const router = Router();
const language = require('../controllers/languageController');

router.get("/language", language.getAll);
router.post("/language/:userId", language.post);
router.delete("/language/:userId/:id", language.delet);

module.exports = router;