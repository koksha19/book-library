const getSignUp = (req, res) => {
  res.render("auth/signup", {
    path: "/signup",
    errors: null,
    isAuthenticated: null,
  });
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

module.exports = { getSignUp, getLogIn, postLogIn, postLogOut };
