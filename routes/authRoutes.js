const express = require("express");
const { check } = require("express-validator");
const User = require("../models/User");

const authControllers = require("../controllers/authControllers");

const router = express.Router();

router.get("/signup", authControllers.getSignUp);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({
          email: value,
        }).then((user) => {
          if (user) {
            throw new Error("User with such email already exists");
          }
        });
      }),
    check(
      "password",
      "Password has to be at least 5 characters long and contain letters and numbers",
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    check("conf_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),
  ],
  authControllers.postSignUp,
);
router.get("/login", authControllers.getLogIn);
router.post("/login", authControllers.postLogIn);
router.post("/logout", authControllers.postLogOut);
router.get("/reset-password", authControllers.getResetPassword);
router.post("/reset-password", authControllers.postResetPassword);
router.get("/new-password/:token", authControllers.getNewPassword);
router.post("/new-password", authControllers.postNewPassword);

module.exports = router;
