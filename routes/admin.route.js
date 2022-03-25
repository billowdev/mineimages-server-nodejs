const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const {
  getAllUserData,
  createCategories,
} = require("../controllers/admin.controllers");

// ----------------- Admin route  ----------------- \\
router.get("/lacakp", validateToken, getAllUserData);

router.post("/categories", createCategories);



module.exports = router;