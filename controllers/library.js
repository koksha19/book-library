const Book = require('../models/Book');

const getBooks = async (req, res) => {
    const books = await Book.find();
    res.render('library/index', {
        books: books,
    });
}

module.exports = { getBooks };