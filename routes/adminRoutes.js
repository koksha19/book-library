const express = require("express");

const adminControllers = require("../controllers/adminControllers");

const router = express.Router();

router.get('/books', adminControllers.getAdminBooks);
router.get('/add-book', adminControllers.getCreateBook)
router.post("/add-book", adminControllers.postCreateBook);
router.post("/delete-book", adminControllers.deleteBook);

module.exports = router;
