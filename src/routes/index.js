const { Router } = require('express')
const router = Router();
const getAllCompanies = require("../controllers/getAllCompanies");


//GETS

router.get("/company", () => { 
    console.log("COMPANY!");
    getAllCompanies();
});
router.get("/itskills", () => { });
router.get("/language", () => { });
router.get("/location", () => { });
router.get("/professional", () => { });
router.get("/projecttype", () => { });
router.get("/review", () => { });
router.get("/user", () => { });
router.get("/nationality", () => { });


module.exports = router;