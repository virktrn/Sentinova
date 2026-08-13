require("dotenv").config();
const Redis = require("ioredis");

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
});

redis.on("connect", () => {
    console.log("✅ Redis connected");
});

redis.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
});

// Get cached data
const getRedis = async (key) => {
    try {
        return await redis.get(key);
    } catch (err) {
        console.error("Redis GET error:", err.message);
        return null;
    }
};

// Set cached data with TTL
const setRedis = async (key, value, ttl = 3600) => {
    try {
        await redis.set(key, value, "EX", ttl);
    } catch (err) {
        console.error("Redis SET error:", err.message);
    }
};

// Delete cache
const deleteRedis = async (key) => {
    try {
        await redis.del(key);
    } catch (err) {
        console.error("Redis DEL error:", err.message);
    }
};

module.exports = {
    redis,
    getRedis,
    setRedis,
    deleteRedis,
};