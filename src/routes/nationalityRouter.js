const { Router } = require('express')
const router = Router();
const nationality = require('../controllers/nationalityController');

router.get("/nationality", nationality.getAll);
router.post("/nationality/:userId", nationality.post);
router.delete("/nationality/:userId/:id", nationality.delet);

module.exports = router;