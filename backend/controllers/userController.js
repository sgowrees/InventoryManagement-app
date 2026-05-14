
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel")
const crypto = require("crypto")
const sendemail = require("../utils/sendEmail")


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};




// register user
const registerUser = asyncHandler( async(req, res) => {
    const {name, email, password} = req.body
    //validation
    if (!name || !email || !password){
        res.status(400)
        throw new Error(("Please fill in all required fields"));
    }
    if(password.length <=5){
        res.status(400)
        throw new Error(("Password must be at least 6 characters long "));
    }
     if(password.length > 25){
        res.status(400)
        throw new Error(("Password must be less than 25 characters"));
    }
    //check if user email already exists
    const userExists = await User.findOne({email})

    if(userExists){
       res.status(400)
        throw new Error(("email has already in use")); 
    }


    //create new user
    const user = await User.create({
        name: name,
        email: email,
        password: password
    });
    
    // generate token
    const token = generateToken(user._id);

    // send HTTP cookie 
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 84600), // 1 day
        sameSite: "none",
        secure: true
    });

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            phone: user.phone,
            bio: user.bio,
            token: token
        });
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }


});


//login user
const loginUser = asyncHandler( async (req, res) => {

    const{email, password} = req.body

    //validate request
    if(!email || !password){
        res.status(400)
        throw new Error(("Please add email and password"));
    }
    //check if user exists
    const user = await User.findOne({email})
        if(!user){
            res.status(400)
            throw new Error(("User not found, please signup"));
    }
    //user exists, check if password correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    // generate token
    const token = generateToken(user._id);

    // send HTTP cookie 
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 84600), // 1 day
        sameSite: "none",
        secure: true
    });

    if (user && passwordIsCorrect){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            phone: user.phone,
            bio: user.bio,
            token: token
        }); 
    } else{
            res.status(400)
            throw new Error(("Invalid email or password"));
    }


});
// logout user
const logoutUser = asyncHandler(async (req,res) => {
    
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), 
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({message: "successfully Logged out"})
});




// Get user Data

const getUser = asyncHandler(async ( req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            phone: user.phone,
            bio: user.bio,
        });
    }else{
        res.status(400)
        throw new Error("user not found")
    }
});



// get login status

const loginStatus = asyncHandler( async ( req, res) =>{
    const token = req.cookies.token
    if (!token){
        return res.json(false);
    }
     //vefiy token
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if(verified){
        return res.json(true);
    }
    return res.json(false);


});


const updateUser = asyncHandler( async ( req, res) =>{
     const user = await User.findById(req.user._id)

    if(user){
        user.name = req.body.name || user.name;
        user.photo = req.body.photo || user.photo;
        user.phone = req.body.phone || user.phone;
        user.bio = req.body.bio || user.bio;

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
        })
    }else{
        res.status(404)
        throw new Error("User not found")
    }
});

// change password

const changePassword = asyncHandler( async ( req, res) =>{
    const user = await User.findById(req.user._id)
    const oldpassword = req.body.oldPassword;
    const password = req.body.password;


    if(!user){
        res.status(400);
        throw new Error("user not found, please sign up ")
    }

    // validate
    if(!oldpassword || !password){
        res.status(400);
        throw new Error("please add old or new password")
    }
    //check if password matches with password in DB
    const passwordIsCorrect = await bcrypt.compare(oldpassword, user.password)

    //save new password
    if (user && passwordIsCorrect){
        user.password = password
        await user.save()
        res.status(200).send("password change successful")
    } else{
         res.status(400)
        throw new Error("old password is incorrect")
    }

});


// forgotPassword
const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }
    //delete token if exists
    let token = await Token.findOne({userid: user._id})
    if (token){
        await token.deleteOne()
    }
  // create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  // hash token before saving
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // save token
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 60 * 1000,
  }).save();

  // reset URL
  const resetURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `
    <h2>Hello ${user.name}</h2>
    <p>Please use the link below to reset your password.</p>
    <p>This link is valid for 30 minutes.</p>
    <a href="${resetURL}">${resetURL}</a>
  `;

  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = process.env.EMAIL_USER;

  try {
    await sendemail(
      subject,
      message,
      send_to,
      sent_from,
      reply_to
    );

    res.status(200).json({
      success: true,
      message: "Reset Email Sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});


// reset password 

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;

    //has tokeen then compare
    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    //find token in db
    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: {
            $gt: Date.now()}
    })
    if(!userToken){
        res.status(404);
        throw new Error("Invalid or expired token");
    }
    // find user
    const user = await User.findOne({_id: userToken.userId})
    user.password = password
    
    await user.save()
    res.status(200).json({
        message: "Password Reset successful, please login"
    });

});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword
    
}
