const express = require("express");
const { check } = require("express-validator");

const adminControllers = require("../controllers/adminControllers");
const isAuthenticated = require("../middleware/isAuth");

const router = express.Router();

const validation = [
  check("title", "Title has to be a string of at least 3 characters")
    .isString()
    .isLength({ min: 3 })
    .trim(),
  check("author", "Author has to be a string").isString().isLength({ min: 3 }),
  check("description", "Description has to contain no more than 50 characters")
    .isAlphanumeric()
    .isLength({ max: 50 })
    .trim(),
  check("overview", "Overview has to contain at least 50 characters").isLength({
    min: 50,
  }),
];

router.get("/books", isAuthenticated, adminControllers.getAdminBooks);
router.get("/add-book", isAuthenticated, adminControllers.getCreateBook);
router.post(
  "/add-book",
  isAuthenticated,
  validation,
  adminControllers.postCreateBook,
);
router.get("/edit-book/:bookId", isAuthenticated, adminControllers.getEditBook);
router.post(
  "/edit-book",
  isAuthenticated,
  validation,
  adminControllers.postEditBook,
);
router.delete("/books/:bookId", isAuthenticated, adminControllers.deleteBook);

module.exports = router;
