const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const { json } = require("body-parser");
const cloudinary = require("cloudinary").v2;
const { uploadToCloudinary , deleteFromCloudinary } = require("../utils/cloudinary");



const createProduct = asyncHandler(async (req,res) => {
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
    let imageURL = '';
    if (req.file){
        const result = await uploadToCloudinary(req.file.buffer);
        imageURL = result.secure_url;
    }
    // create product
    const product = await Product.create({
        userId: req.user._id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        photo: imageURL || "https://res.cloudinary.com/dduozzr2g/image/upload/v1777920605/default-user_nscsn1.jpg"
 
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
            photo: product.photo

    })}else{
        res.status(400)
        throw new Error("Could not create product")
    }

});



//get all products
const getProducts = asyncHandler( async (req, res) =>{

    const products = await Product.find({user: req.user_id});
    res.status(200).json(products)

});


//get one product
const getProduct = asyncHandler( async (req, res) =>{

    const product = await Product.findById(req.params.id);
    //validate
    if(!product){
        res.status(400)
        throw new Error("product not found")
    }

    if (product.user.toString() !== req.user_id){
        res.status(400)
        throw new Error("User not authorized")
    }

    res.status(200).json(product)

});

const deleteProduct = asyncHandler( async (req, res) =>{
    const product = await Product.findById(req.params.id);
    // validate 
    if(!product){
        res.status(400)
        throw new Error("product not found")
    }

    if (product.user.toString() !== req.user_id){
        res.status(400)
        throw new Error("User not authorized")
    }
    // delete product
    await product.remove();
    res.status(200).json({ message: "Product deleted." });

});


const updateProduct = asyncHandler(async (req, res) => {
    const { name, category, quantity, price, description } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);

    // validate
    if (!product) {
        res.status(400);
        throw new Error("Product not found");
    }

    // check ownership
    if (product.userId.toString() !== req.user._id.toString()) {
        res.status(400);
        throw new Error("User not authorized");
    }

    // image upload (optional)
    let imageURL = product.photo;

    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageURL = result.secure_url;
    }

    // update fields
    product.name = name || product.name;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;
    product.price = price || product.price;
    product.description = description || product.description;
    product.photo = imageURL;

    const updatedProduct = await product.save();

    res.status(200).json({
        _id: updatedProduct._id,
        name: updatedProduct.name,
        category: updatedProduct.category,
        quantity: updatedProduct.quantity,
        price: updatedProduct.price,
        description: updatedProduct.description,
        photo: updatedProduct.photo,
    });
});


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,

};
