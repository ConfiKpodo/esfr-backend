// const storage = require("../models/storage.model");
const Storage = require('../models/storage.model');
const mongoose = require("mongoose");
const User = require("../models/user.model");


exports.createStorage = async (req, res) => {
  try {
       const {
      product_name,
      product_height,
      product_length,
      product_width,
      duration,
      note,
      cost,
      dropDate,
      pickupDate,
    } = req.body;

    const userId = req.user?.id;
    // const username = req.user?.username;

    if (
      !product_name ||
      product_height == null ||
      product_length == null ||
      product_width == null ||
      duration == null ||
      cost == null ||
      !dropDate ||
      !pickupDate ||
      !userId
      // !username
    ) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    const images = req.files?.map(file => file.path) || [];

    const storage = await Storage.create({
      product_name,
      product_height: Number(product_height),
      product_length: Number(product_length),
      product_width: Number(product_width),
      duration: Number(duration),
      cost: Number(cost),
      note: note || '',
      images,
      dropDate: new Date(dropDate),
      pickupDate: new Date(pickupDate),
      userId,
      // username
    });

    res.status(201).json({
      success: true,
      data: storage,
    });
  } catch (error) {
    console.error('Create storage error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};




exports.getAllStorage = async (req, res) => {
  try {
    const storages = await Storage
      .find()
      .populate("userId");
    res.status(200).json({ data: storages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateStorage = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};

    // ✅ Only update fields that actually exist
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== '') {
        updates[key] = req.body[key];
      }
    });

    // ✅ Handle images if uploaded
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(
        file => `/uploads/storage/${file.filename}`
      );
    }

    const updatedStorage = await Storage.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedStorage) {
      return res.status(404).json({ message: "Storage not found" });
    }

    res.status(200).json({
      message: "Storage updated successfully",
      data: updatedStorage
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


exports.deleteStorage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStorage = await Storage.findByIdAndDelete(id);
        if (!deletedStorage) {
            return res.status(404).json({ message: "Storage not found" });
        }
        res.status(200).json({ message: "Storage deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
};

exports.getStorageByUser = async (req, res) => {
  try {
    const { identifier } = req.params; 

    let users = [];


    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const user = await User.findById(identifier);
      if (user) users.push(user);
    } 
    
    else {
      users = await User.find({
        username: { $regex: identifier, $options: "i" }, 
      });
    }

    if (!users.length) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userIds = users.map((u) => u._id);

    const storages = await Storage.find({
      userId: { $in: userIds },
    }).populate("userId", "username email");

    res.status(200).json({
      success: true,
      count: storages.length,
      data: storages,
    });

  } catch (error) {
    console.error("Get storage by user error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};