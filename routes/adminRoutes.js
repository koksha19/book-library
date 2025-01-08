const express = require("express");

const adminControllers = require("../controllers/adminControllers");
const isAuthenticated = require("../middleware/isAuth");

const router = express.Router();

router.get("/books", isAuthenticated, adminControllers.getAdminBooks);
router.get("/add-book", isAuthenticated, adminControllers.getCreateBook);
router.post("/add-book", isAuthenticated, adminControllers.postCreateBook);
router.get("/edit-book/:bookId", isAuthenticated, adminControllers.getEditBook);
router.post("/edit-book", isAuthenticated, adminControllers.postEditBook);
router.delete("/books/:bookId", isAuthenticated, adminControllers.deleteBook);

module.exports = router;
