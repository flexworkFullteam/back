const { Router } = require('express')
const router = Router();
const itRoutes = require('./itskillsRouter')
const languageRouter = require('./languageRouter')
const nationalityRouter = require('./nationalityRouter')
const projetFieldsRouter = require('./projetFieldsRouter')
const projettypeRouter = require('./projettypeRouter')

router.use(itRoutes);
router.use(languageRouter);
router.use(nationalityRouter);
router.use(projetFieldsRouter);
router.use(projettypeRouter);



module.exports = router;