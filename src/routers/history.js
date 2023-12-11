const express = require("express");

const historyController = require("../controllers/history");
const router = express.Router();

router.get("/histories/all", historyController.getAll);
router.get("/histories/:id", historyController.detail);
router.get("/histories", historyController.historiesUser);

module.exports = router;
