const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  books: [
    {
      book: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      req: "User",
      required: true,
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
