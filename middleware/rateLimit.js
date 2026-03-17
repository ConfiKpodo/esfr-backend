const rateLimit = require("express-rate-limit");

exports.forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    message: "Too many  attempts...Try in 15 minutes time",
  },
});
