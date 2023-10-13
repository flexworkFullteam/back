const { Router } = require('express')
const router = Router();
const projettype = require('../controllers/projettypeController');

router.get("/projettype", projettype.getAll);
router.post("/projettype", projettype.post);
router.delete("/projettype/:id", projettype.delet);

module.exports = router;