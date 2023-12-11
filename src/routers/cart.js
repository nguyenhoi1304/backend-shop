const express = require("express");
const cartController = require("../controllers/cart");

const router = express.Router();

router.get("/carts", cartController.shoppingCart);
router.post("/carts/add", cartController.add);
router.put("/carts/update", cartController.update);
router.delete("/carts/delete", cartController.delete);

module.exports = router;
