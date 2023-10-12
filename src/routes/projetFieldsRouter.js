const { Router } = require('express')
const router = Router();
const projetFields = require('../controllers/projetFieldsController');

router.get("/projetfields", projetFields.getAll);
router.post("/projetfields", projetFields.post);
router.delete("/projetfields/:id", projetFields.delet);

module.exports = router;