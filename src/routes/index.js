const { Router } = require('express');
const router = Router();
const userRoutes = require('./userRoutes');
const professionalRoutes = require('./professionalRoutes');
const itRoutes = require('./itskillsRouter');
const languageRouter = require('./languageRouter');
const nationalityRouter = require('./nationalityRouter');
const projetFieldsRouter = require('./projetFieldsRouter');
const projettypeRouter = require('./projettypeRouter');
const projectRoutes = require('./projectRoutes');
const companyRouter = require('./companyRouter');
const experienceLevel = require('./experienceLevelRouter');
const reviewRouter = require("./reviewRouter");
const paymentRouter = require("./paymentRouter");


router.use(userRoutes);
router.use(professionalRoutes);
router.use(itRoutes);
router.use(languageRouter);
router.use(nationalityRouter);
router.use(projetFieldsRouter);
router.use(projettypeRouter);
router.use(projectRoutes);
router.use(companyRouter);
router.use(experienceLevel);
router.use(reviewRouter);
router.use(paymentRouter);


module.exports = router;