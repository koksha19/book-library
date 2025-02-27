const express = require("express");

const booksController = require("../controllers/libraryControllers");
const isAuthenticated = require("../middleware/isAuth");

const router = express.Router();

router.get("/", booksController.getBooks);
router.get("/books/:_id", booksController.getBook);
router.get("/cart", isAuthenticated, booksController.getCart);
router.post("/cart", isAuthenticated, booksController.postCart);
router.post("/delete-cart-item", isAuthenticated, booksController.deleteCart);
router.get("/reserved", isAuthenticated, booksController.getOrders);
router.post("/reserved", isAuthenticated, booksController.postOrder);
router.get("/reserved/:orderId", isAuthenticated, booksController.getInvoice);

module.exports = router;
