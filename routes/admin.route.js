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

router.post("/categories", createCategories);



router.post("/checkout/confirm", validateToken, checkoutConfirm);


module.exports = router;