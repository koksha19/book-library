require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./config/connectDb");

const PORT = process.env.PORT || 3000;

const app = express();

connectDb();

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.post('/', (req, res) => {
  res.send("Respond to POST request");
});

mongoose.connection.once('open', () => {
  console.log("Connected to the database");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
})


