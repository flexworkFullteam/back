const { Router } = require('express')
const router = Router();
const nationality = require('../controllers/nationalityController');

router.get("/nationality", nationality.getAll);
router.post("/nationality", nationality.post);
router.delete("/nationality/:id", nationality.delet);

module.exports = router;