const getSignUp = async (req, res) => {
  res.render("auth/signup", {
    path: "/signup",
    errors: null,
  });
};

const getLogIn = async (req, res) => {
  res.render("auth/login", {
    path: "/login",
    errors: null,
  });
};

module.exports = { getSignUp, getLogIn };
