const pageNotFound = (req, res) => {
  return res.render("404", {
    path: "/404",
  });
};

module.exports = pageNotFound;
