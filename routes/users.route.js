const { validateToken } = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const {
  getDataUserController,
  createAddressUser,
  createPaymentUser,
  updateProfile,
  getTestApi
} = require("../controllers/user.controllers");


const {
  getImagesUser,
  createImageUser,
  updateImageUser,
  uploadImageAvartar
} = require("../controllers/images.controllers");

// ----------------- USER route ----------------- \\

// ----------------- GET OWN IMAGES DATA ----------------- \\
router.get("/images", validateToken, getImagesUser);

// ----------------- GET DATA USER WHO SIGN IN (RES TO PROFILE PAGE) route ----------------- \\
router.get("/", validateToken, getDataUserController);
// router.get("/", getTestApi);

// ----------------- POST TO update payment route  ----------------- \\
router.post("/payment", validateToken, createPaymentUser);

// ----------------- POST TO update address route ----------------- \\
router.post("/address", validateToken, createAddressUser);

// ----------------- POST TO Add Image ----------------- \\
router.post("/image", validateToken, createImageUser);

// ----------------- POST TO Update Image ----------------- \\
router.post("/image/:imgId", validateToken, updateImageUser);

// ----------------- PUT TO Update Image ----------------- \\
router.patch("/avartar/upload", validateToken, uploadImageAvartar);

// ----------------- PUT TO Update Image ----------------- \\
router.patch("/profile", validateToken, updateProfile);


module.exports = router;
