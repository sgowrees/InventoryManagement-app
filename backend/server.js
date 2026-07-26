require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorMiddleware");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true
    })
);

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);

app.get("/", (req, res) => {
    res.send("Inventory Management API");
});

app.get("/api/health", async (req, res) => {
    const { isReady } = require("./utils/redis");

    res.status(200).json({
        status: "ok",
        redis: isReady() ? "connected" : "disabled",
        timestamp: new Date().toISOString()
    });
});

app.use(errorHandler);

module.exports = app;