const express = require("express");
const router = express.Router();
const {
	getAllCategories,
} = require("../controllers/categories.controllers");

router.get("/", getAllCategories);  
module.exports = router;
