require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./config/connectDb");
const libraryRoutes = require("./routes/mainPage");

const PORT = process.env.PORT || 3000;

const app = express();

connectDb();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(libraryRoutes);

mongoose.connection.once('open', () => {
  console.log("Connected to the database");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
})


