const { cloudinary } = require("../utils/cloudinary");
const { Images, Users } = require("../models");
const Op = require("sequelize").Op;
const axios = require("axios");
const Jimp = require("jimp");
const BASE_URL = `https://api.cloudinary.com/v1_1/${process.env.CLOUNDINARY_NAME}`;
const auth = {
  username: process.env.CLOUNDINARY_API_KEY,
  password: process.env.CLOUNDINARY_API_SECRET,
};

// =================== FOR USER ROUTE ==========================
exports.getImagesUser = async (req, res) => {
  try {
    const reqUserId = req.user.id;
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.per_page);
    const sortColumn = req.query.sort_column;
    const sortDirection = req.query.sort_direction;
    const search = req.query.search;
    const startIndex = (page - 1) * perPage;

    const total = await Images.count({
      where: { UserId: reqUserId, remove: "NO" },
    });

    let totalPages = total / perPage;
    let images;
    if (search && sortColumn) {
      images = await Images.findAll({
        offset: startIndex,
        limit: perPage,
        where: {
          UserId: reqUserId,
          remove: "NO",
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        order: [[sortColumn, sortDirection]],
      });
    } else if (search) {
      images = await Images.findAll({
        where: {
          UserId: reqUserId,
          remove: "NO",
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      });
    } else if (sortColumn) {
      images = await Images.findAll({
        offset: startIndex,
        limit: perPage,
        where: { UserId: reqUserId, remove: "NO" },
        order: [[sortColumn, sortDirection]],
      });
    } else {
      images = await Images.findAll({
        offset: startIndex,
        limit: perPage,
        where: { UserId: reqUserId, remove: "NO" },
      });
    }

    res.status(200).json({
      success: true,
      msg: "get image success",
      data: {
        page: page,
        per_page: perPage,
        total_pages: totalPages,
        total: total,
        images,
      },
    });
  } catch (err) {
    console.log("Error at get Images user controllers", err);
    res.status(401).send("Error can't get Images");
  }
};

// =================== FOR USER ROUTE ==========================

exports.createImageUser = async (req, res) => {
  const imageReq = req.body;
  const UserId = req.user.id;

  isExist = await Images.findOne({
    where: { pathOrigin: imageReq.pathOrigin, UserId: UserId },
  });

  if (isExist) {
    res.status(500).json({ error: "Image has already exist" });
  } else {
    imageReq.UserId = req.user.id;
    Images.create(imageReq).then(() => {
      res.status(200).json("Add image successfuly");
    });
  }
};

// ===================== update (put, patch) section =====================
exports.updateImageUser = async (req, res) => {
  const imageReq = req.body;
  const ImageId = req.params.imgId;
  const UserId = req.user.id;
  const imageData = await Images.findOne({
    where: { id: ImageId, UserId: UserId },
  });
  // if active it can update to remove or other properties
  if (imageData.status == "active") {
    const data = {
      pathOrigin: imageReq.pathOrigin,
      price: imageReq.price,
      visible: imageReq.visible,
      remove: imageReq.remove,
    };
    await Images.update(data, { where: { UserId: UserId, id: ImageId } }).then(
      () => {
        res.json("update successfully");
      }
    );
  } else {
    const data = {
      pathOrigin: imageReq.pathOrigin,
      price: imageReq.price,
      remove: imageReq.remove,
    };
    await Images.update(data, { where: { UserId: UserId, id: ImageId } }).then(
      () => {
        res.status(201).send("update successfully");
      }
    );
  }
};

exports.getImageById = async (req, res) => {
  const id = req.params.id;
  const image = await Images.findByPk(id);
  res.json(image);
};

exports.uploadImageByUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { name, detail, price, image, CategoryId } = req.body;
    const fileStr = image;
    const uploadOriginalResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "mineimages_original",
    });

    // ========================================================================== //
    const LOGO = "./images/logo.png";
    const watermark = async (img) => {
      const [image, logo] = await Promise.all([
        Jimp.read(Buffer.from(img.split(",")[1], "base64")),
        Jimp.read(LOGO),
      ]);
      logo.resize(100, Jimp.AUTO);

      const X = 60;
      const Y = 60;

      const data = await image.composite(logo, X, Y, [
        {
          mode: Jimp.BLEND_SCREEN,
          opacitySource: 0.1,
          opacityDest: 1,
        },
      ]);

      return data;
    };

    const watermarkImg = await watermark(fileStr);
    const base64Image = await watermarkImg.getBase64Async(
      Jimp.AUTO,
      (err, res) => {
        return res;
      }
    );
    // ========================================================================== //
    const uploadWatermarkResponse = await cloudinary.uploader.upload(
      base64Image,
      {
        upload_preset: "mineimages_watermark",
      }
    );
    console.log(uploadWatermarkResponse);
    const rawImagesData = {
      name: name,
      detail: detail,
      publicId: uploadWatermarkResponse.public_id,
      pathOrigin: uploadOriginalResponse.secure_url,
      pathWatermark: uploadWatermarkResponse.secure_url,
      price: price,
      CategoryId: CategoryId,
      UserId: id,
    };
    const resp = await Images.create(rawImagesData);
    console.log({ success: true, msg: "upload image success", data: resp });
    // console.log(uploadOriginalResponse.secure_url);
    // console.log(uploadWatermarkResponse);
    res.status(200).json({ success: true, msg: "File uploaded sucessfuly" });
  } catch (err) {
    console.log({ success: false, msg: "on upload image", error: err });
    res.status(500).json({ success: false, err: "somthing went wrong" });
  }
};

exports.uploadImageAvartar = async (req, res) => {
  try {
    const id = req.user.id;
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "mineimages_profiles",
    });

    await Users.update(
      { avartar: uploadResponse.secure_url },
      { where: { id: id } }
    );

    res.json({ success: true, msg: "File uploaded sucessfuly" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "somthing went wrong" });
  }
};

exports.getAllImage = async (req, res) => {
  const image = await Images.findAll({
    where: { visible: "public", status: "active", remove: "NO" },
    raw: true,
  });
  let data = [];

  image.forEach((element) => {
    const id = element.id;
    const publicId = element.publicId;
    data.push({ id, publicId });
  });
  return res.send(data);
};

exports.getImageDetail = async (req, res) => {
  const { imgid } = req.body;
  console.log(imgid);
  const { id, publicId, name, detail, pathWatermark, price, UserId } =
    await Images.findOne({
      where: { id: imgid },
    });
  const { firstName } = await Users.findOne({ where: { id: UserId } });

  return res.status(200).send({
    id,
    publicId,
    name,
    detail,
    pathWatermark,
    price,
    owner: firstName,
  });
};

exports.getSearchImages = async (req, res) => {
  const response = await axios.get(BASE_URL + "/resources/search", {
    auth,
    params: {
      expression: req.query.expression,
    },
  });
  return res.send(response.data);
};

exports.patchImageData = async (req, res) => {
  console.log(req.body);
  try {
    const data = req.body;
    const resp = await Images.update(data, { where: { id: req.body.id } });
    console.log(resp);
    res.status(200).json({ success: true, msg: "Update images successfuly" });
  } catch (err) {
    console.log({ success: false, msg: err });
    res.status(400).json({ success: false, msg: err });
  }
};

exports.patchDeleteImage = async (req, res) => {
  try {
    await Images.update(
      { remove: "YES" },
      { where: { id: req.body.id, UserId: req.user.id } }
    );
    res.status(200).json({ success: true, msg: "delete success" });
  } catch (err) {
    console.log({ success: false, msg: "on images controller", error: err });
    res.status(400).json({ success: false, msg: "can't delete images" });
  }
};

exports.getAllImageUserOwned = async (req, res) => {
  try {
    const resp = await Images.findAll({ where: { UserId: req.user.id } });
    if (resp.length != 0) {
      res
        .status(200)
        .json({
          success: true,
          msg: "get images user owned success",
          data: resp,
        });
    } else {
      res.status(400).json({ success: false, msg: "user have no any images" });
    }
  } catch (err) {
    console.log({
      success: false,
      msg: "error on images controllers",
      error: err,
    });
    res.status(400).json({ success: false, msg: "something went wrong!" });
  }
};
