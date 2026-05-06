const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;



const createProduct = asyncHandler(async (res,req) => {
    const { name, sku, category, quantity, price, description } = req.body;

    //validate
    if(!name || !sku || !category || !quantity || !price || !description){
        res.status(400);
        throw new Error("Please fill in missing fields")
    }

    if (price < 0 ){
        res.status(400);
        throw new Error("Invalid price")
    }
    if (quantity < 0 ){
        res.status(400);
        throw new Error("Invalid quantity")
    }

    //img upload
    let imgURL = '';
    if (req.file){
        const result = await uploadToCloudinary(req.file.buffer);
        imgURL = result.secure_url;
    }
    // create product
    const product = await Product.create({
        user: req.user._id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        photo: imageUrl
 
    });
    if (product){
        res.status(201).json({
            user: req.user._id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            quantity: product.quantity,
            price: product.price,
            description: product.description,
            photo: product.imageUrl

    })}else{
        res.status(400)
        throw new Error("Could not create product")
    }

});







module.exports = {
    createProduct

};
