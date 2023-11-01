const { Router } = require('express')
const router = Router();
const it = require('../controllers/itskillsController');

router.get("/itskills", it.getAll);
router.post("/itskills/:userId", it.post);
router.delete("/itskills/:userId/:id", it.delet);

module.exports = router;