const pageNotFound = (req, res) => {
  return res.render("404", {
    path: "/404",
    isAuthenticated: null,
  });
};

module.exports = pageNotFound;
