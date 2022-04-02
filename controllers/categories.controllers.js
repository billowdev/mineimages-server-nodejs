const { cloudinary } = require("../utils/cloudinary");
const { Categories} = require("../models");
const Op = require("sequelize").Op;
const axios = require("axios");

// =================== FOR USER ROUTE ==========================
exports.getAllCategories = async (req, res) => {
  try {
	const categories = await Categories.findAll();
    res.status(200).json({
      success: true,
      msg: "get categories success",
	  categories
    });
  } catch (err) {
    console.log("Error at get categories categories controllers", err);
    res.status(401).send("Error can't get categories");
  }
};
