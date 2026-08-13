// queue/newsQueue.js
const { Queue } = require("bullmq");

const newsQueue = new Queue("news-queue", {
    connection: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379
    }
});

module.exports = newsQueue;
