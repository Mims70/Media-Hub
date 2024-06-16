const User = require("../models/user.model");
const JWT = require("jsonwebtoken");
const JWTSecret = process.env.JWT_SECRET;
const {
  signup,
  requestPasswordReset,
  resetPassword,
  login,
  logout,
  verifyResetCode
} = require("../services/auth.service");

const signUpController = async (req, res, next) => {
  try {
    const signupService = await signup(req.body);
    return res.json(signupService);
  } catch (error) {
    next(error);
  }
};

const resetPasswordRequestController = async (req, res, next) => {
  try {
    const requestPasswordResetService = await requestPasswordReset(req.body.email);
    return res.json(requestPasswordResetService);
  } catch (error) {
    next(error);
  }
};

const resetPasswordController = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body); // Log the entire request body
    const { email, newPassword, confirmPassword } = req.body;

    // Call the resetPassword function with the provided parameters
    const resetPasswordService = await resetPassword(email, newPassword, confirmPassword);
    return res.json(resetPasswordService);
  } catch (error) {
    next(error); // Pass any caught errors to the error handler middleware
  }
};



const loginController = async (req, res, next) => {
  try {
    const loginService = await login(req.body.email, req.body.password);
    return res.json(loginService);
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res) => {
  try {
    // Call the logout function with the user's email and the `res` object
    await logout(req.body.email, res);
  } catch (error) {
    // Handle any errors
    console.error("Error in logout controller:", error);
    res.status(500).json({ error: "An error occurred while logging out" });
  }
};


const verifyCodeController = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;

    // Check if the verification code is provided
    if (!verificationCode) {
      return res.status(400).json({ error: 'Verification code is required' });
    }

    // Find the user by verification code
    const user = await User.findOne({ verificationCode });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the verification code matches
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: 'Wrong verification code' });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    // Return success message
    return res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Error verifying code:', error);
    return res.status(500).json({ error: 'An error occurred while verifying code' });
  }
};

const verifyResetCodeController = async (req, res, next) => {
  try {
    const { resetCode } = req.body;
    // Call verifyResetCode function from service layer
    const verifyCodeService = await verifyResetCode(resetCode);
    return res.json(verifyCodeService);
  } catch (error) {
    next(error); // Pass any caught errors to the error handler middleware
  }
};


module.exports = {
  signUpController,
  resetPasswordRequestController,
  resetPasswordController,
  loginController,
  logoutController,
  verifyCodeController,
  verifyResetCodeController
};