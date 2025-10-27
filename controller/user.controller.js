const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail"); // create this util (see below)

require("dotenv").config();

// ✅ Create a new user
exports.createUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ message: "Email or Username already in use" });
    }

    // Just create the user — password will be hashed automatically by the pre-save hook
    const user = new User(req.body);
    const savedUser = await user.save();

    const userObj = savedUser.toObject();
    delete userObj.password; // remove password before sending back
    res.status(201).json(userObj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get user by username
exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Username parameter is required" });
    }

    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" }, // case-insensitive exact match
    }).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Server error, please try again later" });
  }
};


// ✅ Update user by ID
exports.updateUser = async (req, res) => {
  try {
    // If password is being updated, hash it
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).select(
      "-password"
    );
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    // find by email
    const user = await User.findOne({ email: email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const payload = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    };
   
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      
    }
    
  );
    const userObj = user.toObject();
    delete userObj.password;
    
    res.json({ token, user: userObj.username, email: userObj.email ,name: userObj.name});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// reset password
// Send reset link to user's email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate and hash token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token and expiry on the user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `
      You requested a password reset.
      Please click the link below to set a new password:
      ${resetUrl}
      This link will expire in 10 minutes.
    `;

    await sendEmail(user.email, "Password Reset Request", message);
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPasswordWithToken = async (req, res) => {
  try {
    const { token } = req.params; // token from the URL
    const { newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Missing token or new password" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find matching user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
