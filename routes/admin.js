const express = require("express");

const adminControllers = require("../controllers/adminControllers");

const router = express.Router();

router.post("/add-book", adminControllers.createBook);

module.exports = router;
