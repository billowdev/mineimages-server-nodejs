const { validateToken } = require("../middlewares/AuthMiddleware");
const { Users, Addresses, PaymentUsers, Images } = require("../models");

exports.getAllUserData = async (req, res) => {
  const id = req.user.id;
  const permission = req.user.permission;
  if (!(permission === "admin")) {
    res.status(404).json({ success: false, message: "Page Not Founded" });
  } else {
    const allUser = await Users.findAll();
    res.json(allUser);
  }
};

exports.createCategories = async (req, res) => {
  const post = req.body;
  await Categories.create(post);
  res.json(post);
};
