const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { get, set, del, delPattern, cacheKeys } = require("../utils/redis");

const invalidateProductCache = async (userId, productId) => {
    await del(cacheKeys.products(userId));
    if (productId) await del(cacheKeys.product(productId));
    await delPattern(`products:user:${userId}:*`);
};

const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, quantity, price, description } = req.body;

    if (!name || !sku || !category || !quantity || !price || !description) {
        res.status(400);
        throw new Error("Please fill in missing fields");
    }

    if (price < 0) {
        res.status(400);
        throw new Error("Invalid price");
    }
    if (quantity < 0) {
        res.status(400);
        throw new Error("Invalid quantity");
    }

    const productExists = await Product.findOne({
        $or: [
            { sku: { $regex: `^${sku}$`, $options: "i" } },
            {
                name: { $regex: `^${name}$`, $options: "i" },
                price,
                category: { $regex: `^${category}$`, $options: "i" },
            },
        ],
    });

    if (productExists) {
        res.status(400);
        throw new Error("Product already Exists");
    }

    let imageURL = "";
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageURL = result.secure_url;
    }

    const product = await Product.create({
        userId: req.user._id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        photo:
            imageURL ||
            "https://res.cloudinary.com/dduozzr2g/image/upload/v1777920605/default-user_nscsn1.jpg",
    });

    if (!product) {
        res.status(400);
        throw new Error("Could not create product");
    }

    await invalidateProductCache(req.user._id.toString());

    res.status(201).json({
        _id: product._id,
        userId: req.user._id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
        description: product.description,
        photo: product.photo,
    });
});

const getProducts = asyncHandler(async (req, res) => {
    const { search, sort, category } = req.query;
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const cacheKey = `${cacheKeys.products(userId)}:${search || ""}:${sort || ""}:${category || ""}`;
    const cached = await get(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    let filter = { userId };

    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
        filter.category = category;
    }

    let query = Product.find(filter);

    if (sort) {
        const sortOption =
            sort === "asc" ? "name" : sort === "desc" ? "-name" : sort;
        query = query.sort(sortOption);
    }

    const products = await query;
    await set(cacheKey, products, 300);

    res.status(200).json(products);
});

const getProduct = asyncHandler(async (req, res) => {
    const cacheKey = cacheKeys.product(req.params.id);
    const cached = await get(cacheKey);
    if (cached) {
        if (cached.userId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("User not authorized");
        }
        return res.status(200).json(cached);
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("product not found");
    }

    if (product.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("User not authorized");
    }

    await set(cacheKey, product, 600);
    res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("User not authorized");
    }

    await product.deleteOne();
    await invalidateProductCache(req.user._id.toString(), req.params.id);

    res.status(200).json({ message: "Product deleted." });
});

const updateProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, quantity, price, description } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    if (price < 0) {
        res.status(400);
        throw new Error("Invalid price");
    }
    if (quantity < 0) {
        res.status(400);
        throw new Error("Invalid quantity");
    }

    if (product.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("User not authorized");
    }

    let imageURL = product.photo;

    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageURL = result.secure_url;
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;
    product.price = price || product.price;
    product.description = description || product.description;
    product.sku = sku || product.sku;
    product.photo = imageURL;
    const updatedProduct = await product.save();

    await invalidateProductCache(req.user._id.toString(), id);

    res.status(200).json({
        _id: updatedProduct._id,
        name: updatedProduct.name,
        category: updatedProduct.category,
        quantity: updatedProduct.quantity,
        price: updatedProduct.price,
        sku: updatedProduct.sku,
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
