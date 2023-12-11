const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

// const authAdmin = require("../middleware/authAdmin");

router.post("/admin/login", adminController.adminLogin);
// adminRouter.post("/admin/login", adminController.login);
// adminRouter.get("/admin/auth", authAdmin, (req, res) => {
//   res.json({ authentication: true });
// });
module.exports = router;
