const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 Multiple image URLs
    images: {
      type: [String], // array of image URLs or file paths
      validate: {
        validator: function (arr) {
          return arr.length > 0; // require at least one image
        },
        message: "At least one image is required",
      },
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
