const express = require("express");

const booksController = require("../controllers/libraryControllers");

const router = express.Router();

router.get("/", booksController.getBooks);
router.get("/books/:_id", booksController.getBook);

module.exports = router;
