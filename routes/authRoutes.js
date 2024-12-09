const express = require("express");

const authControllers = require("../controllers/authControllers");

const router = express.Router();

router.get("/signup", authControllers.getSignUp);
router.post("/signup", authControllers.postSignUp);
router.get("/login", authControllers.getLogIn);
router.post("/login", authControllers.postLogIn);
router.post("/logout", authControllers.postLogOut);
router.get("/reset-password", authControllers.getResetPassword);
router.post("/reset-password", authControllers.postResetPassword);
router.get("/new-password/:token", authControllers.getNewPassword);
router.post("/new-password", authControllers.postNewPassword);

module.exports = router;
