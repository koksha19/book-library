const Book = require("../models/Book");

const getAdminBooks = async (req, res) => {
    const books = await Book.find();
    res.render("admin/admin-books", {
        path: "/admin/books",
        books: books,
    });
};

const getCreateBook = async (req, res) => {
    res.render("admin/add-book", {
        path: "/admin/add-book",
    });
}

const postCreateBook = async (req, res) => {
  const { title, author, imageUrl, description } = req.body;

  try {
    await Book.create({
      title: title,
      author: author,
      imageUrl: imageUrl,
      description: description,
    });

    const books = await Book.find();

    res.render("admin/admin-books", {
      path: "/admin/books",
      books: books,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
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

module.exports = { getAdminBooks, getCreateBook, postCreateBook, deleteBook };
