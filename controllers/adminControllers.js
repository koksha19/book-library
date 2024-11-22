const Book = require("../models/Book");

const createBook = async (req, res) => {
  const { title, author, imageUrl, description } = req.body;

  try {
    await Book.create({
      title: title,
      author: author,
      imageUrl: imageUrl,
      description: description,
    });
    res.status(201).redirect("/");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createBook };
