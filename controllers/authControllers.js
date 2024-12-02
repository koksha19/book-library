const bcrypt = require("bcrypt");

const User = require("../models/User");

const getSignUp = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("auth/signup", {
    path: "/signup",
    errors: null,
    user: {
      email: null,
      password: null,
      conf_password: null,
    },
    isAuthenticated: isLoggedIn,
  });
};

const postSignUp = async (req, res) => {
  const { email, password, conf_password } = req.body;
  const isLoggedIn = req.session.isLoggedIn;

  if (!email || !password || !conf_password || password !== conf_password) {
    req.flash("error", "Please, fill in all fields");
    return res.render("auth/signup", {
      path: "/signup",
      editing: false,
      user: {
        email: email,
        password: password,
        conf_password: conf_password,
      },
      errors: req.flash("error"),
      isAuthenticated: isLoggedIn,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email: email,
      password: hashedPassword,
    });
    return res.status(201).redirect("/");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getLogIn = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  console.log(req.session, isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    errors: null,
    isAuthenticated: isLoggedIn,
  });
};

const postLogIn = async (req, res) => {
  const { email, password } = req.body;
  const isLoggedIn = req.session.isLoggedIn;

  if (!email || !password) {
    req.flash("error", "Please, fill in all fields");
    return res.render("auth/login", {
      path: "/login",
      isAuthenticated: isLoggedIn,
      errors: req.flash("error"),
    });
  }

  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) return res.status(401).json({ error: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect("/");
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const postLogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: "Can't destroy session" });
    }
    res.redirect("/");
  });
};

module.exports = { getSignUp, postSignUp, getLogIn, postLogIn, postLogOut };
