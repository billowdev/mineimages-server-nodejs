const { validateToken } = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const { Orders, Transactions, Images } = require("../models");
const { Op } = require("sequelize");

const {
  getAllOrders,
  createUserOrder,
  checkoutOrder,
  getOncartOrders,
  getCompleteOrders,
  getBenefitCompleteOrders,
  deleteOrders
} = require("../controllers/orders.controllers");

router.get("/", validateToken, getAllOrders);

router.get("/cart", validateToken, getOncartOrders);
router.get("/complete", validateToken, getCompleteOrders);
router.get("/complete/benefit", validateToken, getBenefitCompleteOrders);
router.get("/delete/:id", validateToken, deleteOrders);

router.post("/", validateToken, createUserOrder);

router.get("/checkout", validateToken, checkoutOrder);



module.exports = router;
