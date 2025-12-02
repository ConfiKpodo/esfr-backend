const express = require("express");
const {authenticate}= require("../middleware/auth.middleware");
const userUpload = require("../middleware/userUpload");

const {
  createUser,
  getUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  loginUser,
  forgotPassword,
  resetPasswordWithToken,
  
} = require("../controller/user.controller");


const router = express.Router();


// ✅ CRUD routes
router.post("/register",userUpload.single("profileImage"), createUser);
router.get("/allUsers", getUsers);
router.get("/:id", authenticate,getUserById);
router.put("/updateUser/:id",userUpload.single("profileImage"),authenticate, updateUser);
router.delete("/delete/:id",authenticate, deleteUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPasswordWithToken/:token", resetPasswordWithToken);
// search route
router.get("/username/:username", getUserByUsername);

module.exports = router;
