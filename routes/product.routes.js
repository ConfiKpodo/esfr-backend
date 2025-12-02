const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  findProductsByLocation,
  findProductByNameOrLocation,
  findProductsByUsername,
  findProductsByCategory,
  findProductsByName,
  findProductsByUserId
} = require("../controller/product.controller.js");

const router = express.Router();

// FIXED: Now supports file uploads
router.post("/createItem", authenticate, upload.array("images", 5), createProduct);

router.get("/getAllProducts", getProducts);
router.get("/search", findProductByNameOrLocation);
router.get("/location/:location", findProductsByLocation);
router.get("/user/:id", findProductsByUserId);
router.get("/category/:category", findProductsByCategory);
router.get("/:id", getProductById);
router.put("/updateProduct/:id",upload.array('images',5),authenticate, updateProduct);
router.delete("/deleteProduct/:id", authenticate, deleteProduct);
router.get("/name/:name", findProductsByName);


module.exports = router;
