const Book = require("../models/Book");

const createBook = async (req, res) => {
  const { title, author, imageUrl, description } = req.body;
  const books = await Book.find();

  try {
    await Book.create({
      title: title,
      author: author,
      imageUrl: imageUrl,
      description: description,
    });
    res.render("library/index", {
      admin: true,
      path: "/books",
      books: books,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAdminBooks = async (req, res) => {
  const books = await Book.find();
  res.render("library/index", {
    admin: true,
    path: "/books",
    books: books,
  });
};

const deleteBook = async (req, res) => {
  const id = req.body.bookId;
  console.log(id, req.body);

  Book.findById(id)
      .then((book) => {
        console.log(book);
        if (!book) {
          return new Error('No product found');
        }
        return Book.deleteOne({ _id: id });
      })
      .then(() => {
        res.redirect("/admin/books");
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
}

module.exports = { createBook, getAdminBooks, deleteBook };
