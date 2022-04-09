const { validateToken } = require("../middlewares/AuthMiddleware");
const bcrypt = require("bcrypt");
const { createTokens } = require("../middlewares/AuthMiddleware");
const { sign, verify } = require("jsonwebtoken");

const {
  Users,
  Addresses,
  PaymentUsers,
  Images,
  Categories,
  Orders,
  Transactions,
} = require("../models");

const Op = require("sequelize").Op;
// ==================================================================//
//                        USERS CONTROLLERS                         //
// ==================================================================//
exports.getAllUserData = async (req, res) => {
  const permission = req.user.permission;
  console.log(permission);
  if (permission !== "admin") {
    res.status(404).json({ success: false, message: "Page Not Founded" });
  } else {
    try {
      const page = parseInt(req.query.page);
      const perPage = parseInt(req.query.per_page);
      const sortColumn = req.query.sort_column;
      const sortDirection = req.query.sort_direction;
      const search = req.query.search;
      const startIndex = (page - 1) * perPage;

      const total = await Users.count();
      let totalPages = total / perPage;
      let userData;

      if (search && sortColumn) {
        userData = await Users.findAll({
          offset: startIndex,
          limit: perPage,
          attributes: { exclude: ["password"] },
          include: [
            {
              model: Addresses,
              require: true,
            },
          ],
          where: {
            firstName: {
              [Op.like]: `%${search}%`,
            },
          },
          order: [[sortColumn, sortDirection]],
          raw: true,
        });
      } else if (search) {
        userData = await Users.findAll({
          attributes: { exclude: ["password"] },
          include: [
            {
              model: Addresses,
              require: true,
            },
          ],
          where: {
            firstName: {
              [Op.like]: `%${search}%`,
            },
          },
          raw: true,
        });
      } else if (sortColumn) {
        userData = await Users.findAll({
          offset: startIndex,
          limit: perPage,
          attributes: { exclude: ["password"] },
          include: [{ model: Addresses, require: true }],
          order: [[sortColumn, sortDirection]],
          raw: true,
        });
      } else {
        userData = await Users.findAll({
          offset: startIndex,
          limit: perPage,
          attributes: { exclude: ["password"] },
          include: [{ model: Addresses, require: true }],
          raw: true,
        });
      }
      res.status(200).json({
        success: true,
        msg: "get users success",
        data: {
          page: page,
          per_page: perPage,
          total_pages: totalPages,
          total: total,
          data: userData,
        },
      });
    } catch (err) {
      console.log({
        success: false,
        msg: "error on admin get user controller",
        error: err,
      });
      res.status(400).json({ success: false, msg: "something went wrong!" });
    }
  }
};
exports.createUserData = async (req, res) => {
  const permission = req.user.permission;
  if (!(permission === "admin")) {
    res.status(404).json({ success: false, message: "Page Not Founded" });
  } else {
    try {
      const { user, address } = req.body;
      const { firstName, lastName, email, password, telephone, about } = user;
      Users.findAll({ where: { email: email } }).then((response) => {
        if (response.length != 0) {
          res
            .status(400)
            .json({ success: false, msg: "email has already exists" });
        } else {
          bcrypt.hash(password, 10).then((hash) => {
            Users.create({
              password: hash,
              email: email,
              firstName: firstName,
              lastName: lastName,
              telephone: telephone,
              about: about,
            })
              .then((data) => {
                if (address != null || address != {} || address != undefined) {
                  const newAddress = { ...address, ...data.id };
                  Addresses.create(newAddress);
                } else {
                  Addresses.create({
                    addressLine1: "",
                    city: "",
                    postalCode: "",
                    country: "",
                    UserId: data.id,
                  });
                }

                // hook field on PaymentUsers
                PaymentUsers.create({
                  provider: "",
                  cardNumber: "",
                  expiryDate: "",
                  securityCode: "",
                  UserId: data.id,
                });
              })
              .catch((err) => {
                if (err) {
                  console.log("Error in signup while account activation", err);
                  return res.status(400).json({ error: "Error" });
                }
              });
          });
        }
      });
      res.status(200).json({ success: true, msg: "create user successfuly!" });
    } catch (err) {
      console.log({
        success: false,
        msg: "on admin controller create user",
        error: err,
      });
      res.status(400).json({ success: false, msg: "something went wrong!" });
    }
  }
};
exports.updateUserData = async (req, res) => {
  const permission = req.user.permission;
  if (!(permission === "admin")) {
    res.status(404).json({ success: false, message: "Page Not Founded" });
  } else {
    try {
      const user = req.body.user;
      const address = req.body.address;
      console.log(user, address);

      const resp = await Users.update(user, { where: { id: user.id } });
      if (address != {} || address != null || address != undefined) {
        await Addresses.update(address, { where: { UserId: user.id } });
      }
      res.status(200).json({ success: true, msg: "update user success" });
    } catch (err) {
      console.log({
        success: false,
        msg: "on admin controller update user",
        error: err,
      });
      res.status(400).json({ success: false, msg: "something went wrong!" });
    }
  }
};
exports.deleteUserData = async (req, res) => {
  const permission = req.user.permission;
  if (!(permission === "admin")) {
    res.status(404).json({ success: false, message: "Page Not Founded" });
  } else {
    try {
      const id = req.body.id;
      await Users.destroy({ where: { id: id } });
      res.status(200).json({ success: true, msg: "delete user success" });
    } catch (err) {
      console.log({
        success: false,
        msg: "on admin controller delete user",
        error: err,
      });
      res.status(400).json({ success: false, msg: "something went wrong!" });
    }
  }
};

// ================================================================================//
//                        ORDERS & TRANSACTION CONTROLLERS                         //
// ================================================================================//

exports.getAllOrders = async (req, res) => {
  const permission = req.user.permission;
  if (!(permission === "admin")) {
    res.status(404).json({ success: false, message: "Page Not Founded" });
  } else {
    try {
      const page = parseInt(req.query.page);
      const perPage = parseInt(req.query.per_page);
      const sortColumn = req.query.sort_column;
      const sortDirection = req.query.sort_direction;
      const search = req.query.search;
      const startIndex = (page - 1) * perPage;

      const total = await Orders.count();

      let totalPages = total / perPage;
      let data;
      if (search && sortColumn) {
        data = await Orders.findAll({
          offset: startIndex,
          limit: perPage,
          include: [
            {
              model: Images,
              require: true,
              order: [[sortColumn, sortDirection]],
              where: {
                name: {
                  [Op.like]: `%${search}%`,
                },
              },
            },
          ],
        });
      } else if (search) {
        data = await Orders.findAll({
          include: [
            {
              model: Images,
              require: true,
              where: {
                name: {
                  [Op.like]: `%${search}%`,
                },
              },
            },
          ],
        });
      } else if (sortColumn) {
        data = await Orders.findAll({
          offset: startIndex,
          limit: perPage,
          include: [
            {
              model: Images,
              require: true,
              order: [[sortColumn, sortDirection]],
            },
          ],
        });
      } else {
        data = await Orders.findAll({
          offset: startIndex,
          limit: perPage,
          include: [
            {
              model: Images,
              require: true,
            },
          ],
        });
      }
      res.json({
        page: page,
        per_page: perPage,
        total_pages: totalPages,
        total: total,
        data,
      });
    } catch (err) {
      console.log("Error at get order user controllers", err);
      res.status(401).send("Error can't get order");
    }
  }
};

// update orders controllers
exports.updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    await Orders.update(req.body, { where: { id: id } });
    res.status(200).json({ success: true, msg: "update successfuly" });
  } catch (err) {
    console.log({
      success: false,
      msg: "error on admin controllers at update orders",
      error: err,
    });
    res.status(400).json({ success: false, msg: "something went wrong!" });
  }
};

exports.getAllTransactions = async (req, res) => {
  const permission = req.user.permission;
  if (!(permission === "admin")) {
    res.status(404).json({ success: false, message: "Page Not Founded" });
  } else {
    try {
      const page = parseInt(req.query.page);
      const perPage = parseInt(req.query.per_page);
      const sortColumn = req.query.sort_column;
      const sortDirection = req.query.sort_direction;
      const search = req.query.search;
      const startIndex = (page - 1) * perPage;

      const total = await Transactions.count();

      let totalPages = total / perPage;
      let data;
      if (search && sortColumn) {
        data = await Transactions.findAll({
          offset: startIndex,
          limit: perPage,
          order: [[sortColumn, sortDirection]],
          where: {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        });
      } else if (search) {
        data = await Transactions.findAll({
          where: {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        });
      } else if (sortColumn) {
        data = await Transactions.findAll({
          offset: startIndex,
          limit: perPage,
          order: [[sortColumn, sortDirection]],
        });
      } else {
        data = await Transactions.findAll({
          offset: startIndex,
          limit: perPage,
        });
      }
      res.json({
        page: page,
        per_page: perPage,
        total_pages: totalPages,
        total: total,
        data,
      });
    } catch (err) {
      console.log("Error at get order user controllers", err);
      res.status(401).send("Error can't get order");
    }
  }
};

// checkout order to transaction state
exports.checkoutConfirm = async (req, res) => {
  try {
    const transaction = req.body;
    const permission = req.user.permission;
    if (permission != "admin") {
      res.status(404).json("404 not found");
    } else {
      await Transactions.update(
        { status: "complete" },
        { where: { id: transaction.TransactionId } }
      );
      await Orders.update(
        { status: "complete" },
        { where: { TransactionId: transaction.TransactionId } }
      );
      res.status(200).json({ success: true, msg: "checkout confirm complete" });
    }
  } catch (err) {
    console.log({ success: false, msg: "something went wrong!" });
    res
      .status(400)
      .json({ success: false, msg: "something went wrong!", error: err });
  }
};

exports.updateTransactions = async (req, res) => {
  try {
    await Transactions.update(req.body, { where: { id: req.params } });
    res
      .status(200)
      .json({ success: true, msg: "update transaction success fuly" });
  } catch (err) {
    console.log();
    res.status(400).json({ success: false, msg: "something went wrong" });
  }
};

// ==================================================================//
//                        IMAGES CONTROLLERS                         //
// ==================================================================//

exports.getAllImages = async (req, res) => {
  const permission = req.user.permission;
  if (!(permission === "admin")) {
    res.status(404).json({ success: false, message: "Page Not Founded" });
  } else {
    try {
      const page = parseInt(req.query.page);
      const perPage = parseInt(req.query.per_page);
      const sortColumn = req.query.sort_column;
      const sortDirection = req.query.sort_direction;
      const search = req.query.search;
      const startIndex = (page - 1) * perPage;

      const total = await Images.count({ where: { remove: "NO" } });

      let totalPages = total / perPage;
      let images;
      if (search && sortColumn) {
        images = await Images.findAll({
          offset: startIndex,
          limit: perPage,
          where: {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          order: [[sortColumn, sortDirection]],
        });
      } else if (search) {
        images = await Images.findAll({
          where: {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        });
      } else if (sortColumn) {
        images = await Images.findAll({
          offset: startIndex,
          limit: perPage,
          where: { remove: "NO" },
          order: [[sortColumn, sortDirection]],
        });
      } else {
        images = await Images.findAll({
          offset: startIndex,
          limit: perPage,
          where: { remove: "NO" },
        });
      }

      res.status(200).json({
        success: true,
        msg: "get image success",
        data: {
          page: page,
          per_page: perPage,
          total_pages: totalPages,
          total: total,
          images,
        },
      });
    } catch (err) {
      console.log("Error at get Images user controllers", err);
      res.status(401).json("Error can't get Images");
    }
  }
};

// exports.createImages = async (req, res) => {
//   const imageReq = req.body;
//     const UserId = req.user.id;
//     isExist = await Images.findOne({
//       where: { pathOrigin: imageReq.pathOrigin, UserId: UserId },
//     });

//     if (isExist) {
//       res.status(400).json({ error: "Image has already exist" });
//     } else {
//       imageReq.UserId = req.user.id;
//       Images.create(imageReq).then(() => {
//         res.json("Add image successfuly");
//       });
//     }
// };

exports.updateImages = async (req, res) => {
  const imageReq = req.body;
  const ImageId = req.params.imgId;
  const imageData = await Images.findOne({
    where: { id: ImageId },
  });
  // if active it can update to remove or other properties
  if (imageData.status == "active") {
    const data = {
      pathOrigin: imageReq.pathOrigin,
      price: imageReq.price,
      visible: imageReq.visible,
      remove: imageReq.remove,
    };
    await Images.update(data, { where: { id: ImageId } }).then(() => {
      res.json("update successfully");
    });
  } else {
    const data = {
      pathOrigin: imageReq.pathOrigin,
      price: imageReq.price,
      remove: imageReq.remove,
    };
    await Images.update(data, { where: { UserId: UserId, id: ImageId } }).then(
      () => {
        res.status(201).send("update successfully");
      }
    );
  }
};

// ==================================================================//
//                        CATEGORIES CONTROLLERS                     //
// ==================================================================//

exports.createCategories = async (req, res) => {
  const categories = req.body;
  try {
    const exist = await Categories.findOne({ where: { name: req.body.name } });
    if (exist == null) {
      await Categories.create(categories);
      res.status(200).json({ success: true, msg: "create categories success" });
    } else {
      res.status(201).json({
        success: false,
        msg: "can't add categories because it is exist!",
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, msg: "error" });
  }
};

exports.updateCategories = async (req, res) => {
  try {
    const data = req.body;
    await Categories.update(data, { where: { id: req.body.id } });
    res.status(200).json({ success: true, msg: "delete success" });
    res.status(201);
  } catch (err) {
    res.status(400).json({ success: false, msg: "can't delete images" });
  }
};

exports.deleteCategories = async (req, res) => {
  const data = req.body;
  try {
    const resp = await Categories.destroy({ where: { id: data.id } });

    res.status(200).json({ success: true, msg: "delete success" });
  } catch (err) {
    res.status(400).json({ success: false, msg: "can't delete images" });
    console.log({ success: false, msg: "on delete categories", error: err });
  }
};

exports.getCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const categories = await Categories.findOne({ where: { id: id } });
    if (categories != null) {
      res.status(200).json({
        success: true,
        msg: "get category by id success",
        data: categories,
      });
    } else {
      res.status(400).json({ success: false, msg: "can't delete images" });
      console.log(categories);
    }
  } catch (err) {
    res.status(400).json({ success: false, msg: "can't delete images" });
    console.log(err);
  }
};
