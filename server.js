require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const flash = require("connect-flash");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const connectDb = require("./config/connectDb");
const libraryRoutes = require("./routes/mainRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
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

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: storage }).single("imageUrl"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/books/public/images",
  express.static(path.join(__dirname, "public", "images")),
);
app.use(
  "/public/images",
  express.static(path.join(__dirname, "public", "images")),
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: store,
  }),
);
app.use(flash());
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(libraryRoutes);
app.use(authRoutes);
app.use("/admin", adminRoutes);
app.use(pageNotFound);

mongoose.connection.once("open", () => {
  console.log("Connected to the database");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
