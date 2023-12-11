const express = require("express");
const userController = require("../controllers/user");
const { checkPermissionAdmin } = require("../middleware/authAdmin");
const router = express.Router();

router.get("/users", checkPermissionAdmin, userController.findAll);
router.get("/users/:id", userController.getDetail);
router.post("/users/signup", userController.register);
router.post("/users/login", userController.login);
router.post("/users/logout", userController.logout);

module.exports = router;
