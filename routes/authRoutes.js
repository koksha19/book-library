const express = require("express");

const authControllers = require("../controllers/authControllers");

const router = express.Router();

router.get("/signup", authControllers.getSignUp);
router.get("/login", authControllers.getLogIn);

module.exports = router;
