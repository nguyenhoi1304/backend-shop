const express = require("express");

const orderController = require("../controllers/order");
const router = express.Router();

router.post("/orders/add", orderController.placeOrder);
router.post("/email", orderController.sendEmail);
router.get("/orders", orderController.ordersAll);

module.exports = router;
