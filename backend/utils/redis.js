const Redis = require("ioredis");

let redis = null;
let connected = false;

const connectRedis = async () => {
    if (!process.env.REDIS_URL) {
        console.warn("REDIS_URL not set — caching disabled");
        return null;
    }

    try {
        redis = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: 3,
            lazyConnect: true,
        });

        await redis.connect();
        connected = true;
        console.log("Redis connected");
        return redis;
    } catch (err) {
        console.warn("Redis unavailable — caching disabled:", err.message);
        redis = null;
        connected = false;
        return null;
    }
};

const isReady = () => connected && redis !== null;

const get = async (key) => {
    if (!isReady()) return null;
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

const set = async (key, value, ttlSeconds = 300) => {
    if (!isReady()) return;
    try {
        await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch {
        /* ignore cache write failures */
    }
};

const del = async (...keys) => {
    if (!isReady() || keys.length === 0) return;
    try {
        await redis.del(...keys);
    } catch {
        /* ignore cache delete failures */
    }
};

const delPattern = async (pattern) => {
    if (!isReady()) return;
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) await redis.del(...keys);
    } catch {
        /* ignore */
    }
};

const cacheKeys = {
    products: (userId) => `products:user:${userId}`,
    product: (id) => `product:${id}`,
    user: (id) => `user:${id}`,
};

module.exports = {
    connectRedis,
    get,
    set,
    del,
    delPattern,
    cacheKeys,
    isReady,
};
