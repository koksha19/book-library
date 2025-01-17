const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Book = require("../models/Book");
const Order = require("../models/Order");

const ITEMS_PER_PAGE = 2;

const getBooks = async (req, res) => {
  const page = req.query.page || "1";
  const books = await Book.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  res.render("library/index", {
    path: "/",
    page: page,
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
    .catch(() => {
      res.status(500).json({ message: "Can't get cart" });
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
    })
    .catch(() => {
      res.status(500).json({ message: "Can't post to cart" });
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
    })
    .catch(() => {
      res.status(500).json({ message: "Can't delete item from cart" });
    });
};

const getOrders = async (req, res) => {
  const orders = await Order.find({
    "user.userId": req.user._id,
  });
  res.render("library/reserved", {
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
    })
    .catch(() => {
      res.status(500).json({ message: "Can't reserve books" });
    });
};

const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No such order"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }

      const fileName = `invoice-${orderId}.pdf`;
      const filePath = path.join("data", "invoices", fileName);

      const PDFDoc = new PDFDocument();

      PDFDoc.pipe(fs.createWriteStream(filePath));
      PDFDoc.pipe(res);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");

      PDFDoc.fontSize(27).text(`Invoice-${orderId}`, {
        underline: true,
      });
      PDFDoc.fontSize(16).text(
        "---------------------------------------------------------------------------------------",
      );
      PDFDoc.text("Reserved books:");
      order.books.forEach((book) => {
        PDFDoc.text("       • " + book.book.title + ": " + book.quantity);
      });
      PDFDoc.text(
        "---------------------------------------------------------------------------------------",
      );
      PDFDoc.fontSize(22).text("Your order is being processed by our team.");
      PDFDoc.fontSize(22).text("It will be ready until 18 PM today.");
      PDFDoc.end();
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  getInvoice,
};
