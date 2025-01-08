const fs = require("fs");
const Book = require("../models/Book");

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
  });
};

const postCreateBook = async (req, res) => {
  const { title, author, description, overview } = req.body;
  const image = req.file;

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
    return res.status(500).json({ message: err.message });
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
  });
};

const postEditBook = async (req, res) => {
  console.log(req.body);
  const { title, author, description, overview, bookId } = req.body;
  const image = req.file;

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(500).json({ message: "No such book" });
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

  try {
    let imageUrl;
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
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteBook = async (req, res) => {
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
      return res.status(500).json({ message: err.message });
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
