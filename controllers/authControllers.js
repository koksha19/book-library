const bcrypt = require("bcrypt");
const Mailjet = require("node-mailjet");
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
