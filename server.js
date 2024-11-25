require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const connectDb = require("./config/connectDb");
const libraryRoutes = require("./routes/mainRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pageNotFound = require("./controllers/pageNotFound");

const PORT = process.env.PORT || 3000;

const app = express();

connectDb();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Math.random() * 100000 + "-" + file.originalname);
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: storage }).single("imageUrl"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/public/images",
  express.static(path.join(__dirname, "public", "images")),
);

app.use(libraryRoutes);
app.use("/admin", adminRoutes);
app.use(pageNotFound);

mongoose.connection.once("open", () => {
  console.log("Connected to the database");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
