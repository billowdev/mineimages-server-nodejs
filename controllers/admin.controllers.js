const { validateToken } = require("../middlewares/AuthMiddleware");
const {
  Users,
  Addresses,
  PaymentUsers,
  Images,
  Categories,
  Orders,
  Transactions,
} = require("../models");

// ==================================================================//
//                        USERS CONTROLLERS                         //
// ==================================================================//
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

// ================================================================================//
//                        ORDERS & TRANSACTION CONTROLLERS                         //
// ================================================================================//

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
};

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
            remove: "NO",
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          order: [[sortColumn, sortDirection]],
        });
      } else if (search) {
        images = await Images.findAll({
          where: {
            remove: "NO",
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
      res.status(401).send("Error can't get Images");
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
    const exist = await Categories.findOne({where:{name:req.body.name}})
    if(exist==null){
      await Categories.create(categories);
      res.status(200).json({ success: true, msg: "create categories success" });
    }else{
      res.status(201).json({success:false, msg:"can't add categories because it is exist!"})
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
      res
        .status(200)
        .json({
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
