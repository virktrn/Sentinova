require("dotenv").config();

const axios = require("axios");
const Article = require("../models/Article");
const { Op } = require("sequelize");
const { deleteRedis } = require("../config/redisClient");

const API_KEY = process.env.GNEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4/top-headlines";

const CATEGORIES = [
    "general",
    "world",
    "business",
    "technology",
    "sports",
    "entertainment",
    "health"
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createEnhancedContent(article) {
    const description = article.description || "";
    const content = article.content || "";

    const summary = `
${description}

Key Highlights:
• Major development reported by ${article.source?.name || "the source"}
• Important details surrounding the event
• Potential impact on people, organizations, or markets
• Story may continue to evolve as more information becomes available
`.trim();

    const fullReport = `
WHAT HAPPENED

${description}

FULL REPORT

${content}

WHY IT MATTERS

This story is significant because it highlights an important development that could influence future decisions, public opinion, business activity, technology trends, or policy discussions depending on the nature of the event.

KEY TAKEAWAYS

• The event represents a noteworthy recent development.
• Stakeholders are closely monitoring the situation.
• Additional updates are expected as more information becomes available.
• Readers should follow future reports for confirmed developments.

SOURCE

${article.source?.name || "GNews"}
`.trim();

    return {
        summary,
        fullReport
    };
}

async function fetchCategory(category) {
    try {
        const url = `${BASE_URL}?category=${category}&lang=en&max=10&apikey=${API_KEY}`;

        console.log(`🔍 Fetching ${category}...`);

        const response = await axios.get(url);

        return response?.data?.articles || [];
    } catch (err) {
        console.error(
            `❌ API Error (${category}):`,
            err.response?.data || err.message
        );

        return [];
    }
}

async function saveArticles(category, articles) {
    if (!articles.length) {
        console.log(`⚠ No articles found for ${category}`);
        return 0;
    }

    let insertedCount = 0;

    for (const article of articles) {
        try {
            const exists = await Article.findOne({
                where: {
                    [Op.or]: [
                        { title: article.title },
                        { source_url: article.url }
                    ]
                }
            });

            if (exists) {
                continue;
            }

            const enhanced = createEnhancedContent(article);

            await Article.create({
                title: article.title,

                summary: enhanced.summary,

                content: enhanced.fullReport,

                slug: article.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, ""),

                category,

                image: article.image || "",

                source_url: article.url,

                isPublished: true,

                publishedAt: new Date(
                    article.publishedAt || new Date()
                ),

                author: article.source?.name || "GNews"
            });

            insertedCount++;

            console.log(`✔ Saved: ${article.title}`);
        } catch (err) {
            console.error(
                `❌ Insert Error: ${err.message}`
            );
        }
    }

    return insertedCount;
}

async function fetchNews() {
    console.log("\n🚀 Starting GNews Fetcher...");

    if (!API_KEY) {
        throw new Error("Missing GNEWS_API_KEY");
    }

    let totalInserted = 0;

    for (const category of CATEGORIES) {
        console.log(`\n==========================`);
        console.log(`📰 Category: ${category}`);
        console.log(`==========================`);

        const articles = await fetchCategory(category);

        const inserted = await saveArticles(
            category,
            articles
        );

        totalInserted += inserted;

        await wait(1500);
    }

    if (totalInserted > 0) {
        await deleteRedis("homepage_articles");
        await deleteRedis("latest_articles");

        console.log(
            `🧹 Redis cache cleared (${totalInserted} new articles)`
        );
    }

    console.log(`\n✅ Fetch complete.`);
    console.log(
        `📊 New Articles Added: ${totalInserted}`
    );

    return totalInserted;
}

module.exports = fetchNews;

if (require.main === module) {
    fetchNews()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}