const Book = require("../models/Book");

const getBooks = async (req, res) => {
  const books = await Book.find();
  res.render("library/index", {
    path: "/",
    books: books,
  });
};

const getBook = async (req, res) => {
  const bookId = req.params._id;
  if (bookId === "favicon.ico") return res.redirect("/");
  const book = await Book.findById(bookId).exec();
  res.render("library/book", {
    path: "/book",
    book: book,
  });
};

const getCart = async (req, res) => {
  res.render("library/cart", {
    path: "/cart",
  });
};

const postCart = (req, res) => {
  const bookId = req.body.bookId;
  Book.findById(bookId)
    .then((book) => {
      return req.user.addToCart(book);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

module.exports = { getBooks, getBook, getCart, postCart };
