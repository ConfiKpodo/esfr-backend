//feedback routes
const express = require('express');
const router = express.Router();
const feedbackController = require('../controller/feedback.controller');
const {authenticate}= require("../middleware/auth.middleware");
// ✅ Create feedback
router.post('/', authenticate, feedbackController.createFeedback);

// ✅ Get all feedback
router.get('/', authenticate, feedbackController.getFeedback);
// ✅ Delete feedback by id
router.delete('/:id',  authenticate, feedbackController.deleteFeedback);
module.exports = router;