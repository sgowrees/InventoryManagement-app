const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const { upload } = require("../utils/fileUpload");

const { 
    createProduct,
    updateProduct,
    getProducts,
    getProduct,
    deleteProduct,

    }= require('../controllers/productController');


router.post("/", protect, upload.single("image"), createProduct);
router.patch("/:id", protect, upload.single("image"), updateProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;