const fs = require("fs");
const { validationResult } = require("express-validator");
const Book = require("../models/Book");

const mongoose = require("mongoose");

const getAdminBooks = async (req, res) => {
  const books = await Book.find({ userId: req.session.user._id });
  return res.render("admin/admin-books", {
    path: "/admin/books",
    books: books,
  });
};

const getCreateBook = async (req, res) => {
  return res.render("admin/add-book", {
    path: "/admin/add-book",
    editing: false,
    book: {
      title: null,
      author: null,
      description: null,
      overview: null,
    },
    errors: null,
    validationErrors: [],
  });
};

const postCreateBook = async (req, res, next) => {
  const { title, author, description, overview } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-book", {
      path: "/admin/add-book",
      editing: false,
      book: {
        title: title,
        author: author,
        description: description,
        overview: overview,
      },
      errors: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  if (!title || !author || !description || !overview || !image) {
    req.flash("error", "Please, fill in all fields");
    return res.render("admin/add-book", {
      path: "/admin/add-book",
      editing: false,
      book: {
        title: title,
        author: author,
        description: description,
        overview: overview,
      },
      errors: req.flash("error"),
    });
  }

  try {
    const imageUrl = image.path;
    await Book.create({
      title: title,
      author: author,
      imageUrl: imageUrl,
      description: description,
      overview: overview,
      userId: req.session.user._id,
    });
    return res.status(201).redirect("/admin/books");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getEditBook = async (req, res) => {
  const bookId = req.params.bookId;
  const book = await Book.findById(bookId).exec();

  return res.render("admin/add-book", {
    path: "/admin/edit-book",
    editing: true,
    book: book,
    errors: null,
    validationErrors: [],
  });
};

const postEditBook = async (req, res, next) => {
  console.log(req.body);
  let imageUrl;
  const { title, author, description, overview, bookId } = req.body;
  const image = req.file;

  const errors = validationResult(req);

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(500).json({ message: "No such book" });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-book", {
      path: "/admin/edit-book",
      editing: true,
      book: book,
      errors: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  if (!title || !author || !description || !overview) {
    req.flash("error", "Please, fill in all fields");
    return res.render("admin/add-book", {
      path: "/admin/edit-book",
      editing: true,
      book: book,
      errors: req.flash("error"),
    });
  }

  if (image) {
    await fs.unlink(`./${book.imageUrl}`, (err) => {
      if (err) console.error(err);
      console.log("Deleted image");
    });
    imageUrl = image.path;
  }
  book
    .updateOne({
      title: title,
      author: author,
      description: description,
      overview: overview,
      imageUrl: imageUrl,
    })
    .then(() => {
      return res.status(201).redirect("/admin/books");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const deleteBook = async (req, res, next) => {
  const id = req.params.bookId;

  await Book.findById(id)
    .then(async (book) => {
      if (!book) {
        return new Error("No product found");
      }
      await fs.unlink(`./${book.imageUrl}`, (err) => {
        if (err) console.error(err);
        console.log("Deleted image");
      });
      return Book.deleteOne({ _id: id });
    })
    .then((book) => {
      res
        .status(200)
        .json({ message: "Book deleted successfully", data: book });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports = {
  getAdminBooks,
  getCreateBook,
  postCreateBook,
  getEditBook,
  postEditBook,
  deleteBook,
};
