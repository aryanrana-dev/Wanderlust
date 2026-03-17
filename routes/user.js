const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router.get("/signup", userController.renderSignupForm);

router.post("/signup", userController.signup);

router.get("/login", userController.renderLoginForm);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), userController.login);

router.get("/logout", userController.logout);

router.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. The route Google sends the user back to
router.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true, // If you are using connect-flash
  }),
  (req, res) => {
    // Successful authentication! Passport automatically attached the user to req.session
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect("/listings"); // Or wherever your home page is
  }
);

module.exports = router;