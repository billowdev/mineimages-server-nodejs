const { validateToken } = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();

const {
  getImageById,
  createImageUser,
  uploadImageByUser,
  getAllImage,
  getImageDetail,
  patchImageData,
  patchDeleteImage,
  getAllImageUserOwned
} = require("../controllers/images.controllers");

router.get("/all", getAllImage); // display to public
router.get("/", getAllImage); // display to public

router.get("/search", getAllImage);

router.get("/all/owned", validateToken, getAllImageUserOwned);

router.post("/detail", getImageDetail);

router.get("/byId/:id", getImageById);

router.post("/", createImageUser);

router.post("/upload", validateToken, uploadImageByUser);

router.patch("/", validateToken, patchImageData);

router.patch("/delete", validateToken, patchDeleteImage);

module.exports = router;
