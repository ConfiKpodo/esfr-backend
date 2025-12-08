const mongoose = require("mongoose");

const transportationSchema = new mongoose.Schema(
  {
    agentName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    postalAddress: {
      type: String,
      required: true,
      trim: true,
    },

    photo: {
      type: String, // URL or file path
      default: "",
    },

    truckType: {
      type: String,
      enum: ["small", "medium", "large", "pickup", "trailer"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransportAgent", transportationSchema);
