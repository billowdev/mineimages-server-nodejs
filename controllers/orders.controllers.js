const { Orders, Transactions, Images, Users } = require("../models");
const Op = require("sequelize").Op;
const { conn } = require("../config/rawQueryConfig");
const { response } = require("express");
const e = require("express");

exports.getAllOrders = async (req, res) => {
  try {
    const reqUserId = req.user.id;
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.per_page);
    const sortColumn = req.query.sort_column;
    const sortDirection = req.query.sort_direction;
    const search = req.query.search;
    const startIndex = (page - 1) * perPage;

    const total = await Orders.count({ where: { UserId: reqUserId } });

    let totalPages = total / perPage;
    let data;
    if (search && sortColumn) {
      data = await Orders.findAll({
        offset: startIndex,
        limit: perPage,
        where: { UserId: reqUserId },
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
        where: { UserId: reqUserId },
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
        where: { UserId: reqUserId },
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
        where: { UserId: reqUserId },
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
};

exports.createUserOrder = async (req, res) => {
  const ImageId = req.body.id;
  const rawDataImages = await Images.findOne({
    where: { id: ImageId },
    raw: true,
  });
  if (rawDataImages == null) {
    res.status(400).json({ success: false, msg: "somthing went wrong!" });
  } else {
    const UserId = req.user.id; // คนซื้อ
    const price = rawDataImages.price; // ราคาตอนซื้อ
    // solution handle turorial
    /*
     How to Create a Node.js Cluster for Speeding Up Your Apps
    - https://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/
    Let It Crash: Best Practices for Handling Node.js Errors on Shutdown
    - https://blog.heroku.com/best-practices-nodejs-errors
  */

    /* -------------- Order route -------------- 
  | order condition: 
  | 1. if that user has already owner of that image (check it by choice 2)
  | 2. which each transaction user who login status (on "pending" or "complete") -> transaction
  | 3.   if transaction and target ImageId has already in Orders:
  | 4.      return false; |# -- end process -- #|
  | 5. if (user has transaction status "oncart"):
  | 6.      if (the [target ImageId] and TransactionId["oncart"] is exist):
  | 7.          return false; |# -- end process -- #|
  | 8.      Else if that [ImageId and that Transaction] is not exist:
  | 9.          create order with the target ImageId and That TransactionId which oncart status;
  | 10.  else (user has not TransactionId["oncart"]):
  | 11.       then create Transaction.then( create order with target ImageId and this.Transaction.id )
  | 12. |# -- end process -- #|
  */
    // ----------------- condition 1 - 4 working ------------------- \\
    const orderComplete = await Orders.findOne({
      where: {
        UserId: UserId,
        ImageId: ImageId,
        status: "complete",
      },
    }).then((data) => {
      return data;
    });

    // ----------------- condition 5 - 12 working ------------------- \\
    if (orderComplete == null) {
      const orderIsExist = await Orders.findOne({
        where: {
          ImageId: ImageId,
          UserId: UserId,
          [Op.or]: [{ status: "oncart" }, { status: "transaction" }],
        },
      });
      const imageIsExist = await Images.findOne({
        where: {
          UserId: UserId,
          id: ImageId,
        },
      });

      if (!orderIsExist && !imageIsExist) {
        Orders.create({
          ImageId: ImageId,
          price: price,
          UserId: UserId,
        })
          .then((response) => {
            res.status(200).json({
              success: true,
              msg: "create order successfully",
              data: response,
            });
          })
          .catch((err) => {
            if (err) {
              res.status(400).json({ success: false, error: err });
            }
          });
      } else {
        res.status(201).json({
          success: false,
          msg: "this image has already oncart or image already on transaction or you have alreay own this image",
        });
      }
    } else {
      res.json({
        text: "You have already owned this image ",
        item: orderComplete,
      });
    }
  }
};

exports.checkoutOrder = async (req, res) => {
  const UserId = req.user.id;

  const orderOnCart = await Orders.findAll({
    where: { UserId: UserId, status: "oncart" },
  });

  if (orderOnCart.length != 0) {
    const transactionIsExist = await Transactions.findOne({
      where: { UserId: UserId, status: "pending" },
    });

    let ImageIdList = [];
    orderOnCart.forEach((element) => {
      ImageIdList.push(element.ImageId);
    });

    if (transactionIsExist) {
      await Orders.update(
        {
          TransactionId: transactionIsExist.id,
          status: "transaction",
        },
        {
          where: {
            UserId: UserId,
            ImageId: ImageIdList,
            status: "oncart",
          },
        }
      ).then(() => {
        res
          .status(200)
          .json({ success: true, msg: "checkout orders successfuly!" });
      });
    } else {
      const transaction = await Transactions.create({ UserId: UserId });

      if (!transaction) {
        res.status(400).json("something wrong");
      } else {
        await Orders.update(
          {
            status: "transaction",
            TransactionId: transaction.id,
          },
          {
            where: {
              UserId: UserId,
              ImageId: ImageIdList,
            },
          }
        ).then(() => {
          res
            .status(200)
            .json({ success: true, msg: "checkout orders successfuly!" });
        });
      }
    }
  } else {
    res.status(201).json({ success: false, msg: "null" });
  }
};

exports.getOncartOrders = async (req, res) => {
  try {
    const reqUserId = req.user.id;
    const oncart = await Orders.findAll({
      where: { status: "oncart", UserId: reqUserId },
      attributes: {
        exclude: ["TransactionId", "UserId", "ImageId"],
      },
      include: [
        {
          model: Images,
          require: true,
          attributes: ["name", "detail", "pathWatermark"],
        },
        {
          model: Users,
          require: true,
          attributes: ["firstName"],
        },
      ],
      raw: true,
    });

    if (oncart.length != 0) {
      // console.log(oncart[0]['Image.pathWatermark'])
      // console.log(oncart[0])
      let totalItem = oncart.length;
      let totalPrice = 0.0;
      oncart.forEach((element) => {
        totalPrice += parseFloat(element.price);
      });
      res.status(200).json({
        success: true,
        msg: "order on cart success",
        data: { oncart, totalItem, totalPrice },
      });
    }
  } catch (err) {
    console.log({
      success: false,
      msg: `error at order controller "getOncartOrders" : ${err}`,
    });
    response
      .status(400)
      .json({ success: false, msg: "can't get oncart orders" });
  }
};

exports.getCompleteOrders = async (req, res) => {
  try {
    const reqUserId = req.user.id;
    const complete = await Orders.findAll({
      where: { status: "complete", UserId: reqUserId },
      attributes: {
        exclude: ["TransactionId", "UserId", "ImageId"],
      },
      include: [
        {
          model: Images,
          require: true,
          attributes: ["name", "detail", "pathWatermark", "pathOrigin"],
        },
        {
          model: Users,
          require: true,
          attributes: ["firstName"],
        },
      ],
      raw: true,
    });

    if (complete.length != 0) {
      // console.log(complete[0]['Image.pathWatermark'])
      // console.log(complete)
      let totalItem = complete.length;
      res.status(200).json({
        success: true,
        msg: "order on cart success",
        data: { complete, totalItem },
      });
    } else {
      res.status(201).json({ success: false, msg: "have no order complete" });
    }
  } catch (err) {
    console.log({
      success: false,
      msg: `error at order controller "getCompleteOrders" : ${err}`,
    });
    response
      .status(400)
      .json({ success: false, msg: "can't get complete orders" });
  }
};

exports.getBenefitCompleteOrders = async (req, res) => {
  try {
    const reqUserId = req.user.id;
    const complete = await Orders.findAll({
      where: { status: "complete" },
      attributes: ['price', 'id', 'UserId', 'updatedAt'],
      include: [
        {
          model: Images,
          where: { UserId: reqUserId },
          require: true,
          attributes: ["UserId"],
        },
      ],
      raw: true,
    });

    if (complete.length != 0) {
      let totalItem = complete.length;
      res.status(200).json({
        success: true,
        msg: "get order success",
        data: { complete, totalItem },
      });
    } else {
      res.status(201).json({ success: false, msg: "have no order complete" });
    }
  } catch (err) {
    console.log({
      success: false,
      msg: `error at order controller "getbenefitCompleteOrders" : ${err}`,
    });
    response
      .status(400)
      .json({ success: false, msg: "can't get complete orders" });
  }
};

exports.deleteOrders  = async (req, res) => {
  try {
    console.log(req.params.id)
    await Orders.destroy({where:{id:req.params.id}}).then(resp=>{
      res.status(200).json({success:true, msg:"delete success"})
    })
    
  } catch (err) {
    console.log({
      success: false,
      msg: `error at order controller orders " : ${err}`,
    });
    response
      .status(400)
      .json({ success: false, msg: "can't delete order" });
  }
};
