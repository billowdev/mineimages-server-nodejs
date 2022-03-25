const { validateToken } = require("../middlewares/AuthMiddleware");
const express = require("express");
const router = express.Router();
const { Images, Categories } = require("../models");
const { cloudinary } = require("../utils/cloudinary");

const {
  getAllImagesUserOwned,
  getImageById,
  createImageUser,
  uploadImageByUser,
  getAllImage,
  getImageDetail
} = require("../controllers/images.controllers");


router.get("/", getAllImage);
router.get("/search", getAllImage);
router.post("/detail", getImageDetail);


router.get("/byId/:id", getImageById);

router.post("/", createImageUser);

router.post("/upload", validateToken,  uploadImageByUser);




module.exports = router;
