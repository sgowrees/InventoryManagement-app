const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true, "Please add a name"]
    },
    email:{
        type: String, 
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid email"]
    },
    password:{
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "password must be at least 6 characters long "],
        // maxLength: [25, "password must not be more than 25 characters long"]
    },
    photo:{
        type: String,
        required: [true, "Please enter a photo"],
        default: "https://res.cloudinary.com/dduozzr2g/image/upload/v1777920605/default-user_nscsn1.jpg"
    },
    phone:{
        type: String,
        default: "+1"
    },
    bio:{
        type: String,
        default: "bio",
        maxLength: [250, "bio must not be more than 250 characters"]
    },
    isAdmin:{
        type: Boolean
    }
},

    
    {       
        timestamps:true
    }


)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model("User", userSchema);
module.exports = User;