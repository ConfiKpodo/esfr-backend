const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  searchAgents,
} = require("../controller/transportation.controller");
const { authenticate } = require("../middleware/auth.middleware");

/* Multer config for photo uploads */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/agents");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

const upload = multer({ storage });

/* Routes */
router.post("/create", upload.single("photo"),authenticate, createAgent);
router.get("/agents", getAllAgents);
router.get("/search", searchAgents);
router.get("user/:id", getAgentById);
router.put("/update/:id", upload.single("photo"), updateAgent);
router.delete("/delete/:id", deleteAgent);

module.exports = router;
