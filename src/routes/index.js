const { Router } = require('express')
const userRoutes = require('./userRoutes');
const professionalRoutes = require('./professionalRoutes');
const router = Router();

router.use(userRoutes);
router.use(professionalRoutes);

//GETS

router.get("/company", () => { });
router.get("/itskills", () => { });
router.get("/language", () => { });
router.get("/location", () => { });
router.get("/professional", () => { });
router.get("/projecttype", () => { });
router.get("/review", () => { });
router.get("/user", () => { });
router.get("/nationality", () => { });


module.exports = router;