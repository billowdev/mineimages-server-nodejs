const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const {
  createCategories,
  checkoutConfirm,
  getAllOrders,
  getAllImages,
  getImagesById,
  updateImages,
  // createImages,
  updateCategories,
  deleteCategories,
  getCategoriesById,
  getAllUserData,
  updateUserData,
  createUserData,
  deleteUserData,
  getOrdersOnTransaction,
  getCompletedTransactions
} = require("../controllers/admin.controllers");

// ----------------- Admin route  ----------------- \\
router.get("/lacakp", validateToken, getAllUserData);

router.get("/users/get", validateToken, getAllUserData);
router.post("/users/create", validateToken, createUserData);
router.patch("/users/update", validateToken, updateUserData);
router.patch("/users/delete", validateToken, deleteUserData);
// ----------------- IMAGES ROUTE  ----------------- \\
router.get("/images", validateToken, getAllImages);
router.get("/images/byId/:id", validateToken, getImagesById);
router.patch("/images/update", updateImages);
// router.post("/images/insert", createImages);

router.get("/orders/get",validateToken, getAllOrders);

router.get("/transactions/get/on-transaction",validateToken, getOrdersOnTransaction);
router.get("/transactions/get/completed",validateToken, getCompletedTransactions);
// router.get("/transactions",validateToken,);

router.post("/categories/create",validateToken, createCategories);
router.patch("/categories/update",validateToken, updateCategories);
router.patch("/categories/delete",validateToken, deleteCategories);
router.get("/categories/get/:id",validateToken, getCategoriesById);

router.get("/checkout/confirm/:id", validateToken, checkoutConfirm);


module.exports = router;