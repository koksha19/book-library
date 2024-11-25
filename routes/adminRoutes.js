const express = require("express");

const adminControllers = require("../controllers/adminControllers");

const router = express.Router();

router.get('/books', adminControllers.getAdminBooks);
router.post("/add-book", adminControllers.createBook);
router.post("/delete-book", adminControllers.deleteBook);

module.exports = router;
