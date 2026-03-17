const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true
    },

    product_height: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    product_length: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    product_width: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    duration: {
      type: Number,
      required: true,
      min: 1
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    note: String,

    cost: {
      type: Number,
      required: true
    },

    images: {
      type: [String],
      default: []
    },

    dropDate: Date,
    pickupDate: Date
  },
  { timestamps: true }
);

storageSchema.index({ userId: 1 });

module.exports = mongoose.model("Storage", storageSchema);
