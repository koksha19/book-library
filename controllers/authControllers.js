const bcrypt = require("bcrypt");

const User = require("../models/User");

const getSignUp = (req, res) => {
  res.render("auth/signup", {
    path: "/signup",
    errors: null,
    user: {
      email: null,
      password: null,
      conf_password: null,
    },
    isAuthenticated: null,
  });
};

const postSignUp = async (req, res) => {
  const { email, password, conf_password } = req.body;

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
      isAuthenticated: null,
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

const postLogIn = (req, res) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
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
