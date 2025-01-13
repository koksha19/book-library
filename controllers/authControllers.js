const bcrypt = require("bcrypt");
const Mailjet = require("node-mailjet");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
);

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
    validationErrors: [],
  });
};

const postSignUp = async (req, res) => {
  const { email, password, conf_password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      errors: errors.array()[0].msg,
      user: {
        email: email,
        password: password,
        conf_password: conf_password,
      },
      validationErrors: errors.array(),
    });
  }

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
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email: email,
      password: hashedPassword,
    });

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "lev.bereza@gmail.com",
            Name: "MyLibrary administrator",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: "Account successfully created!",
          TextPart:
            "Dear user, we wanted to inform you that you have successfully created a new account on MyLibrary.",
          HTMLPart:
            '<h3>Dear user, welcome to <a href="http://localhost:3000/">MyLibrary</a>!</h3><br />',
        },
      ],
    });

    request
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err.statusCode);
      });

    return res.status(201).redirect("/");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getLogIn = (req, res) => {
  res.render("auth/login", {
    path: "/login",
    errors: null,
  });
};

const postLogIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash("error", "Please, fill in all fields");
    return res.render("auth/login", {
      path: "/login",
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
      res.status(401).render("auth/login", {
        path: "/login",
        errors: "Incorrect password",
      });
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

const getResetPassword = (req, res) => {
  res.render("auth/reset-password", {
    path: "/reset",
    errors: null,
  });
};

const postResetPassword = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email: email });

  if (!user) {
    res.redirect("/reset-password");
  }

  try {
    const token = crypto.randomBytes(32).toString("hex");
    await user.updateOne({
      token: token,
      tokenExpirationDate: Date.now() + 1000 * 60 * 5,
    });

    console.log(token);

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "lev.bereza@gmail.com",
            Name: "MyLibrary administrator",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: "Reset password request",
          TextPart: "Dear user, we received a request to change password",
          HTMLPart: `<h3>Click <a href="http://localhost:3000/new-password/${token}">this link</a> to reset your password!</h3><br />`,
        },
      ],
    });

    request
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
  } catch (err) {
    res.status(500).json({ message: "Resetting password failed" });
  }
};

const getNewPassword = async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({
    token: token,
    tokenExpirationDate: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.redirect("/reset-password");
  }

  console.log(user.email, user.token);

  res.render("auth/new-password", {
    path: "/new-password",
    errors: null,
    email: user.email,
    token: user.token,
    tokenExpirationDate: user.tokenExpirationDate,
  });
};

const postNewPassword = async (req, res) => {
  const { password, conf_password, email, token, tokenExpirationDate } =
    req.body;

  if (!password || !conf_password) {
    req.flash("error", "Please, fill in all fields");
    return res.render("auth/new-password", {
      path: "/new-password",
      errors: req.flash("error"),
      email: email,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
    });
  }

  const user = await User.findOne({
    email: email,
    token: token,
    tokenExpirationDate: {
      $gt: Date.now(),
    },
  });

  try {
    if (password !== conf_password) {
      req.flash("error", "Passwords don't match");
      return res.render("auth/new-password", {
        path: "/new-password",
        errors: req.flash("error"),
        email: email,
        token: token,
        tokenExpirationDate: tokenExpirationDate,
      });
    }

    const newPassword = await bcrypt.hash(password, 10);

    await user.updateOne({
      password: newPassword,
      token: null,
      tokenExpirationDate: null,
    });
    return res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: "Can't change password" });
  }

  console.log(user);
};

module.exports = {
  getSignUp,
  postSignUp,
  getLogIn,
  postLogIn,
  postLogOut,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
};
