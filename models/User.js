const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  tokenExpirationDate: {
    type: Date,
  },
  cart: {
    items: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (book) {
  const id = book._id;
  const bookIndex = this.cart.items.findIndex(
    (item) => item.bookId.toString() === id.toString(),
  );

  if (bookIndex >= 0) {
    this.cart.items[bookIndex].quantity++;
  } else {
    this.cart.items.push({ bookId: id, quantity: 1 });
  }

  return this.save();
};

userSchema.methods.removeFromCart = function (book) {
  const id = book._id;

  const bookIndex = this.cart.items.findIndex(
    (item) => item.bookId.toString() === id.toString(),
  );

  if (bookIndex >= -1) this.cart.items.splice(bookIndex, 1);
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
