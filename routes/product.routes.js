const express = require("express");
const {authenticate}= require("../middleware/auth.middleware");
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
  findProductsByName
} = require("../controller/product.controller.js");

const router = express.Router();

router.post("/createItem", authenticate, createProduct);
router.get("/getAllProducts", getProducts);
router.get("/search", findProductByNameOrLocation);
router.get("/location/:location", findProductsByLocation);
router.get("/user/:username", findProductsByUsername);
router.get("/category/:category", findProductsByCategory);
router.get("/:id", getProductById);
router.put("/updateProduct/:id",authenticate, updateProduct);
router.delete("/deleteProduct/:id",authenticate, deleteProduct);
router.get("/name/:name", findProductsByName);

module.exports = router;
