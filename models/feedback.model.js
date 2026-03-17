const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name:{
        type: String,
        
    },
    feedback:{
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("feedback", feedbackSchema);
