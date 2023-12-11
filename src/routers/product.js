const { Router } = require("express");
const productController = require("../controllers/product");
const { checkPermissionAdmin } = require("../middleware/authAdmin");
const router = Router();

// const { authRole } = require("../middleware/authRole");

router.get("/products", productController.findAll);
router.get("/products/pagination", productController.pagination);
router.post("/products/add", checkPermissionAdmin, productController.add);
router.put("/products/:id", checkPermissionAdmin, productController.putProduct);
router.delete(
  "/products/:id",
  checkPermissionAdmin,
  productController.deleteProduct
);
router.get("/products/:id", productController.detail);

module.exports = router;
