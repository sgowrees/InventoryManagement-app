const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const { upload } = require("../utils/fileUpload");

const { 
    createProduct,

    }= require('../controllers/productController');



router.post("/", protect, upload.single("image"), createProduct);

module.exports = router;