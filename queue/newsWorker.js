// queue/newsWorker.js
require("dotenv").config();
const { Worker } = require("bullmq");
const axios = require("axios");
const slugify = require("slugify");
const Article = require("../models/Article");

// We will import io from server.js safely later
let io = null;
try {
    io = require("../server").io;
} catch (e) {
    console.log("⚠ WebSocket not initialized yet.");
}

const worker = new Worker(
    "news-queue",
    async (job) => {
        console.log("⏳ Worker running job:", job.name, "Category:", job.data.category);

        const category = job.data.category;

        const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&apikey=${process.env.GNEWS_API_KEY}`;

        const { data } = await axios.get(url);

        if (!data.articles) return;

        for (const item of data.articles) {
            if (!item.title) continue;

            const slug = slugify(item.title, { lower: true });

            // Avoid duplicates
            const exists = await Article.findOne({ where: { slug } });
            if (exists) continue;

            const article = await Article.create({
                title: item.title,
                slug,
                summary: item.description || "",
                content: item.content || "",
                category,
                author: item.source?.name || "Unknown",
                image: item.image || null,
                source_url: item.url || null,
                publishedAt: item.publishedAt || new Date(),
                isPublished: true
            });

            console.log("🆕 Saved:", item.title);

            // WebSocket Broadcast
            if (io) {
                io.emit("new-article", {
                    title: article.title,
                    slug: article.slug,
                    image: article.image,
                    category: article.category
                });
            }
        }
    },
    {
        connection: {
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: process.env.REDIS_PORT || 6379
        }
    }
);

worker.on("completed", (job) => {
    console.log(`✔ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.log(`❌ Job failed: ${job.id}`, err.message);
});

module.exports = worker;
