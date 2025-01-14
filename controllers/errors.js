const pageNotFound = (req, res) => {
  return res.render("404", {
    path: "/404",
  });
};

const serverError = (req, res) => {
  return res.render("500", {
    path: "/500",
  });
};

module.exports = { pageNotFound, serverError };
