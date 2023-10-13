const { Router } = require('express')
const router = Router();
const getCompany = require("../controllers/companyController");


//GETS

router.get("/company/:id", getCompany.getCompanyById);
router.get("/company", getCompany.getCompanies);
router.post("/company", getCompany.postCompany);
router.get("/itskills", () => { });
router.get("/language", () => { });
router.get("/location", () => { });
router.get("/professional", () => { });
router.get("/projecttype", () => { });
router.get("/review", () => { });
router.get("/user", () => { });
router.get("/nationality", () => { });


module.exports = router;