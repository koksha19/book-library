const pageNotFound = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  return res.render("404", {
    path: "/404",
    isAuthenticated: isLoggedIn,
  });
};

module.exports = pageNotFound;
