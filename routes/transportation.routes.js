const express = require("express");
const path = require("path");
const multer = require("multer");

const router = express.Router();

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
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* Routes */
router.post("/create", authenticate, upload.single("photo"), createAgent);
router.get("/agents", getAllAgents);
router.get("/search/:name", searchAgents);
router.get("/user/:id", getAgentById);
router.put("/update/:id", authenticate, upload.single("photo"), updateAgent);
router.delete("/delete/:id", authenticate, deleteAgent);

module.exports = router;
