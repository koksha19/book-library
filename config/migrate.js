require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

const User = require("../models/User");

(async () => {
  await User.updateMany(
    { cart: { $exists: false } },
    { $set: { cart: { items: [] } } },
  );
  mongoose.disconnect();
})();
