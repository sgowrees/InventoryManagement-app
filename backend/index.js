require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require("mongoose");
const app = require("./server");
const { connectRedis } = require("./utils/redis");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectRedis();
        await mongoose.connect(process.env.MONGO_URI);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();