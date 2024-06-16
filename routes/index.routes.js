const {
    signUpController,
    resetPasswordRequestController,
    resetPasswordController,
    loginController,
    logoutController,
    verifyCodeController,
    verifyResetCodeController
  } = require("../controllers/authController");

  const {login, callback} = require("../controllers/spotify.controller");
  
  const router = require("express").Router();
  
  router.post("/auth/signup", signUpController);
  router.post("/auth/requestResetPassword", resetPasswordRequestController);
  router.post("/auth/resetPassword", resetPasswordController);
  router.post("/auth/login", loginController);
  router.post("/auth/logout", logoutController);
  router.post("/auth/verifyCode", verifyCodeController);
  router.post("/auth/verifyResetCode", verifyResetCodeController);
  router.get("/spotify/login", login);
  router.get("/callback", callback);

  
  module.exports = router;