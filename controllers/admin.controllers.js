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


exports.checkoutConfirm = async (req, res) => {
  const transaction = req.body;
  const permission = req.user.permission;
  if (permission == "user") {
    res.status(404).json("404 not found");
  } else {
    await Transactions.update(
      { status: "complete" },
      { where: { id: transaction.TransactionId } }
    );

    await Orders.update(
      { status: "complete" },
      { where: { TransactionId: transaction.TransactionId } }
    ).then((response) => {
      res.json("checkout confirm complete");
    });
  }
}
