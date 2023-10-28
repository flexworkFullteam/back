const { Router } = require("express");
const router = Router();
const admin = require("../controllers/adminController");


router.get('/admin/:id', admin.getAdminById);
router.post('/admin', admin.postAdmin);
router.post('/admin/valid/:id', admin.validateuser);
//router.get('/admins',admin.getAllAdmin);


module.exports=router;