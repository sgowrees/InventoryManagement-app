const mongoose = require("mongoose")
const productSchema = mongoose.Schema({
     userId:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "user"
        },
    name: {
        type: String,
         required: true,
         trim: true
        },
    photo:{
        type: String,
        required: true,
        default: "https://res.cloudinary.com/dduozzr2g/image/upload/v1777920605/default-user_nscsn1.jpg"
    },
    description:{
        type: String,
        default: "bio",
        maxLength: [250, "bio must not be more than 250 characters"]
    },
    quantity: {
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    }, 
    sku:{
        type: String,
        required: true,
        trim: true
    },
    category:{
        type: String,
        required: true,
        trim: true
    }
},
    {
        timestamps: true
    }

);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;