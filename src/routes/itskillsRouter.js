const { Router } = require('express')
const router = Router();
const it = require('../controllers/itskillsController');

router.get("/itskills", it.getAll);
router.post("/itskills", it.post);
router.delete("/itskills/:id", it.delet);

module.exports = router;