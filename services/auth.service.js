const JWT = require("jsonwebtoken");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const clientURL = process.env.CLIENT_URL || "localhost";

const signup = async (data) => {
  try {
    // Check if the user already exists
    let user = await User.findOne({ email: data.email });
    if (user) {
      throw new Error("Email already exists");
    }

    // Generate a 4-digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    // Create a new user with isVerified set to false, verification code, and extracted username
    user = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      isVerified: false, // Set isVerified to false indicating pending registration
      verificationCode: verificationCode,
    });

    // Save the user to the database
    await user.save();

    // Log the verification code after saving the user
    console.log('Verification Code:', verificationCode);

    // Send the verification code to the user's email address
    sendEmail(
      user.email,
      "Email Verification",
      {
        name: user.name, // Pass username to the email template
        verificationCode: verificationCode,
      },
      "./template/verificationCode.handlebars"
    );

    // Return user data along with token
    return { message: 'User created successfully. Please verify your email address before login.' };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};


const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email does not exist");
  }

  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  // Generate a 4-digit verification code
  const resetCode = Math.floor(1000 + Math.random() * 9000);

  // Save the reset code to the database
  await new Token({
    userId: user._id,
    token: resetCode.toString(), // Store the code as a string
    createdAt: Date.now(),
  }).save();

  // Send the verification code to the user's email address
  sendEmail(
    user.email,
    "Password Reset Request",
    {
      name: user.name,
      resetCode: resetCode, // Pass the reset code to the email template
    },
    "./template/requestResetPassword.handlebars"
  );
  return { message: "Reset code sent successfully to your email" };
};

const verifyResetCode = async (resetCode) => {
  // Find token by reset code
  const token = await Token.findOne({ token: resetCode });
  if (!token) {
    throw new Error("Invalid or expired reset code");
  }
  // Optionally, you can check if the reset code has expired here

  // Return success message or any relevant data
  return { message: "Reset code verified successfully" };
};


const resetPassword = async (email, newPassword, confirmPassword) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email");
    }

    // Check if the reset code exists and is valid
    const token = await Token.findOne({ userId: user._id });
    if (!token) {
      throw new Error("Invalid or expired reset code");
    }

    // Compare newPassword and confirmPassword
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Log the value of bcryptSalt to ensure it's properly defined
    console.log("bcryptSalt:", bcryptSalt);

    // Hash the new password
    const hash = await bcrypt.hash(newPassword, Number(bcryptSalt));

    // Update user's password
    await User.updateOne({ email }, { password: hash });

    // Send email notification
    await sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.name,
      },
      "./template/resetPassword.handlebars"
    );

    // Delete the reset token
    await token.deleteOne();

    // Return success message
    return { message: "Password reset successfully" };
  } catch (error) {
    throw error; // Re-throw the error to be caught by the caller
  }
};





const login = async (email, password) => {
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if the user's email is verified
  if (!user.isVerified) {
    throw new Error("Email is not verified. Please verify your email to log in.");
  }

  // Compare the provided password with the hashed password in the database
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  // Generate a JWT token
  const token = JWT.sign({ id: user._id }, JWTSecret);

  return {
    userId: user._id,
    email: user.email,
    name: user.name,
    token: token,
  };
};



const logout = async (email, res) => {
  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find and delete the token associated with the user's email
    await Token.findOneAndDelete({ email });

    // Clear the JWT token by sending an empty cookie with a short expiration time
    res.cookie('jwt', '', { maxAge: 1 });

    // Send a JSON response to signify logout
    return res.json({ message: "Logout successful" });
  } catch (error) {
  
    console.error("Error logging out:", error);
    return res.status(500).json({ error: "An error occurred while logging out" });
  }
};



module.exports = {
  signup,
  requestPasswordReset,
  resetPassword,
  login,
  logout,
  verifyResetCode
};