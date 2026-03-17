const feedback = require("../models/feedback.model");

// ✅ Create feedback
exports.createFeedback = async (req, res) => {
  try {
    const feedbackData = req.body;  
    const savedFeedback = await feedback.create(feedbackData);

    res.status(201).json(savedFeedback);
  } catch (error) {
    res.status(500).json({error:error.message});
  } 
};
// ✅ Get all feedback
exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await feedback.find();    
    res.status(200).json(feedbacks);
  }
    catch (error) {

    res.status(500).json({ error: error.message });
    }
};

//delete feedback by id
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await feedback.findByIdAndDelete(id); 
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};