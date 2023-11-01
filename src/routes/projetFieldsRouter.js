const { Router } = require('express')
const router = Router();
const projetFields = require('../controllers/projetFieldsController');

router.get("/projetfields", projetFields.getAll);
router.post("/projetfields/:userId", projetFields.post);
router.delete("/projetfields/:userId/:id", projetFields.delet);

module.exports = router;