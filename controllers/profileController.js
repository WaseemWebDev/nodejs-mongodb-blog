const users = require("../modals/User");
const posts = require("../modals/post");

const profileLoad = async (req, res) => {
  const userId = req.id;
  let currentPage = 1;
  let page = req.params.page;
  if (page) {
    currentPage = page;
  }
  const perPage = 4;
  const skip = (currentPage - 1) * perPage;
  const user = await users.findOne({ _id: userId });
  const count = await posts.find({ userId: userId }).countDocuments();
  await posts.find({ userId: userId }).skip(skip)
    .limit(perPage).populate('userId', 'name').exec(function (err, items) {
      // console.log(items)
      res.render("profile", { login: true, user, items, count, perPage, currentPage ,title:"Home"});
    });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/login");
    }
  });
};

module.exports = {
  profileLoad,
  logout,
};
