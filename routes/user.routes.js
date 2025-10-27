const express = require("express");
const {authenticate}= require("../middleware/auth.middleware");

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
router.post("/register", createUser);
router.get("/allUsers", getUsers);
router.get("/:id", authenticate,getUserById);
router.put("/updateUser/:id",authenticate, updateUser);
router.delete("/:id",authenticate, deleteUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPasswordWithToken/:token", resetPasswordWithToken);
// search route
router.get("/username/:username", getUserByUsername);

module.exports = router;
