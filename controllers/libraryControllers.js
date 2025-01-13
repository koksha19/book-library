const Book = require("../models/Book");
const Order = require("../models/Order");

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
  req.user
    .populate("cart.items.bookId")
    .then((user) => {
      const items = user.cart.items;
      res.render("library/cart", {
        path: "/cart",
        items: items,
      });
    })
    .catch((err) => {
      console.error(err);
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

const deleteCart = (req, res) => {
  const bookId = req.body.bookId;

  Book.findById(bookId)
    .then((book) => {
      return req.user.removeFromCart(book);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

const getOrders = async (req, res) => {
  const orders = await Order.find({
    "user.userId": req.user._id,
  });
  const titles = res.render("library/reserved", {
    path: "/reserved",
    orders: orders,
  });
};

const postOrder = (req, res) => {
  req.user
    .populate("cart.items.bookId")
    .then(async (user) => {
      const books = user.cart.items.map((book) => {
        return {
          book: { ...book.bookId._doc },
          quantity: book.quantity,
        };
      });
      await Order.create({
        books: books,
        user: {
          email: user.email,
          userId: user._id,
        },
      });
    })
    .then(() => {
      req.user.clearCart();
      res.redirect("/reserved");
    });
};

module.exports = {
  getBooks,
  getBook,
  getCart,
  postCart,
  deleteCart,
  getOrders,
  postOrder,
};
