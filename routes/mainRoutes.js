const express = require('express');

const booksController = require('../controllers/libraryControllers');

const router = express.Router();

router.get('/', booksController.getBooks);

module.exports = router;