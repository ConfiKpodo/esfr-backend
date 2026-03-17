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

    // Remove paymentHistory if client tries to send it
    delete req.body.paymentHistory;

    // ✅ Save uploaded profile image path
if (req.file) {
  req.body.profileImage = `/uploads/users/${req.file.filename}`;
}



    const user = new User(req.body);
    const savedUser = await user.save();

    const userObj = savedUser.toObject();
    delete userObj.password;

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

    const users = await User.find({
      username: { $regex: username, $options: "i" }  // partial + case-insensitive
    }).select("-password -__v");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No matching users found" });
    }

    res.status(200).json(users); // now returns ARRAY of matches
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Server error, please try again later" });
  }
};



// ✅ Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // 🔐 Hash password if updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // 🖼️ Override profile image if a new one is uploaded
    if (req.file) {
      updateData.profileImage = `/uploads/users/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

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

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      role: user.role,
    };
   
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      
    }
    
  );
    const userObj = user.toObject();
    delete userObj.password;
    
    res.json({ token, user: userObj.username, email: userObj.email ,name: userObj.name,id: userObj._id});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// reset password
// Send reset link to user's email
exports.forgotPassword = async (req, res) => {
  try {
    let email = req.body.email;

    // 🛡 Normalize email (handle bad payloads safely)
    if (typeof email === 'object' && email?.email) {
      email = email.email;
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 🔐 Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    await sendEmail(
      user.email,
      'Password Reset Request',
      `Reset your password using this link:\n${resetUrl}\n\nThis link expires in 10 minutes.`
    );

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: 'Server error. Please try again later',
    });
  }
};




exports.resetPasswordWithToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Missing token or new password' });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // ✅ Assign raw password
    user.password = newPassword;

    // ✅ Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); // pre('save') hashes password once

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
