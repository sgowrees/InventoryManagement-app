const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");

//import route
const userRoute = require("./routes/userRoute");


const app = express();
const PORT = process.env.PORT || 5000;  

// Middlewares
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//route Middleware
app.use("/api/users", userRoute);


//routes
app.get("/", (req, res) => {
    res.send("Home Page");
});


//error middleware
app.use(errorHandler);


//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then( () =>{

    app.listen(PORT, () => {
        console.log(`Server Running on port ${PORT}`);
        console.log(`http://localhost:5000/`);
    });
})
.catch((err) => console.log(err));


