const Book = require("../models/Book");

const getBooks = async (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  const books = await Book.find();
  res.render("library/index", {
    path: "/",
    books: books,
    isAuthenticated: isLoggedIn,
  });
};

const getBook = async (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  const bookId = req.params._id;
  if (bookId === "favicon.ico") return res.redirect("/");
  const book = await Book.findById(bookId).exec();
  res.render("library/book", {
    path: "/book",
    book: book,
    isAuthenticated: isLoggedIn,
  });
};

module.exports = { getBooks, getBook };
