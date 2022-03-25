const { validateToken } = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const { Orders, Transactions, Images } = require("../models");
const { Op } = require("sequelize");

const { getAllOrders } = require("../controllers/orders.controllers");

router.get("/", validateToken, getAllOrders);

router.post("/", validateToken, async (req, res) => {
  console.log(req.body);
  const ImageId = req.body.dataImage.id;
  const UserId = req.user.id;
  const price = req.body.dataImage.price;

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
  const orderComplete = await Orders.findAll({
    where: {
      UserId: UserId,
      ImageId: ImageId,
      status: "complete",
    },
  }).then((data) => {
    return data;
  });

  // ----------------- condition 5 - 12 working ------------------- \\
  if (orderComplete.length == 0) {
    const orderIsExist = await Orders.findOne({
      where: {
        ImageId: ImageId,
        UserId: UserId,
        [Op.or]: [{ status: "oncart" }, { status: "transaction" }],
      },
    });

    if (!orderIsExist) {
      Orders.create({
        ImageId: ImageId,
        price: price,
        UserId: UserId,
      })
        .then((response) => {
          res.json({ header: "create order successfully", data: response });
        })
        .catch((err) => {
          if (err) {
            res.status(500).json({ error: err });
          }
        });
    } else {
      res.json(
        "this image has already oncart or image already on transaction "
      );
    }
  } else {
    res.json({
      text: "You have already owned this image ",
      item: orderComplete[0],
    });
  }
});

router.post("/checkout", validateToken, async (req, res) => {
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
      ).then((response) => {
        res.json({ text: "checkout order status pending", data: response });
      });
    } else {
      const transaction = await Transactions.create({ UserId: UserId });

      if (!transaction) {
        res.status(500).json("something wrong");
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
        ).then((response) => {
          res.json({ text: "checkout order status pending", data: response });
        });
      }
    }
  } else {
    res.json("cart null");
  }
});

router.post("/checkout/confirm", validateToken, async (req, res) => {
  const transaction = req.body;
  const UserId = req.user.id;
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
});

module.exports = router;
