const Book = require("../models/Book");

const getBooks = async (req, res) => {
  const books = await Book.find();
  res.render("library/index", {
    path: "/",
    books: books,
  });
};

const getBook = async (req, res, next) => {
  const bookId = req.params._id;
  console.log(bookId);
  if (bookId === "favicon.ico") return res.redirect("/");
  const book = await Book.findOne({ _id: bookId }).exec();
  res.render("library/book", {
    path: "/book",
    book: book,
  });
};

module.exports = { getBooks, getBook };
