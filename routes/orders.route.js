const { validateToken } = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const { Orders, Transactions, Images } = require("../models");
const { Op } = require("sequelize");

const {
  getAllOrders,
  createUserOrder,
  checkoutOrder
} = require("../controllers/orders.controllers");

router.get("/", validateToken, getAllOrders);

router.post("/", validateToken, createUserOrder);

router.post("/checkout", validateToken, checkoutOrder);


module.exports = router;
