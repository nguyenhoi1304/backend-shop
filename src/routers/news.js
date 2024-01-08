const express = require("express");

const newsController = require("../controllers/news");

const router = express.Router();

router.get("/news", newsController.getAllNews);
router.post("/news", newsController.createNews);

module.exports = router;
