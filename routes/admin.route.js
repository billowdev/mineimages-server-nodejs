const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const {
  getAllUserData,
  createCategories,
  checkoutConfirm
} = require("../controllers/admin.controllers");

// ----------------- Admin route  ----------------- \\
router.get("/lacakp", validateToken, getAllUserData);

router.get("/users");
router.get("/images");
router.get("/orders");
router.get("/transactions");

router.post("/categories", createCategories);



router.post("/checkout/confirm", validateToken, checkoutConfirm);


module.exports = router;