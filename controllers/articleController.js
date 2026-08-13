const Article = require("../models/Article");
const { Op } = require("sequelize");
const slugify = require("slugify");

// HOME PAGE
exports.homePage = async (req, res) => {
    try {
        const queryCategory = req.query.category || "All";

        let filter = { isPublished: true };

        if (queryCategory !== "All") {
            filter.category = queryCategory;
        }

        const articles = await Article.findAll({
            where: filter,
            order: [["createdAt", "DESC"]],
            limit: 20,
        });

        return res.render("index", {
            articles,
            pageTitle: "Latest News",
            queryCategory,
        });
    } catch (error) {
        console.error("Home Page Error:", error);
        return res.status(500).render("error", {
            message: "Failed to load homepage",
        });
        const trendingArticles = await Article.findAll({
            where: {
                isPublished: true
            },
            limit: 5,
            order: [["createdAt", "DESC"]]
        });
        return res.render("index", {
            articles,
            pageTitle: "Latest News",
            queryCategory,
            trendingArticles
        });
    }
};

// VIEW ARTICLE
exports.viewArticle = async (req, res) => {
    try {
        const { slug } = req.params;

        const article = await Article.findOne({
            where: { slug }
        });

        if (!article) {
            return res.status(404).render("404");
        }

        const relatedArticles = await Article.findAll({
            where: {
                category: article.category,
                id: {
                    [Op.ne]: article.id
                },
                isPublished: true
            },
            limit: 4,
            order: [["createdAt", "DESC"]]
        });

        const trendingArticles = await Article.findAll({
            where: {
                isPublished: true
            },
            limit: 5,
            order: [["createdAt", "DESC"]]
        });

        res.render("article", {
            pageTitle: article.title,
            article,
            relatedArticles,
            trendingArticles,
            readMoreUrl: article.source_url
        });

    } catch (error) {
        console.error("View Article Error:", error);

        res.status(500).render("error", {
            message: "Failed to load article"
        });
    }
};

// SEARCH
exports.search = async (req, res) => {
    try {
        const q = req.query.q || "";

        const articles = await Article.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${q}%` } },
                    { summary: { [Op.like]: `%${q}%` } },
                    { content: { [Op.like]: `%${q}%` } },
                ],
            },
            order: [["createdAt", "DESC"]],
        });

        return res.render("index", {
            articles,
            pageTitle: `Search results for "${q}"`,
            queryCategory: "All",
        });
    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).render("error", {
            message: "Search failed",
        });
    }
};

// ADMIN DASHBOARD
exports.adminDashboard = async (req, res) => {
    try {
        const articles = await Article.findAll({
            order: [["createdAt", "DESC"]],
        });

        return res.render("admin/dashboard", {
            articles,
            pageTitle: "Admin Dashboard",
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).render("error", {
            message: "Failed to load dashboard",
        });
    }
};

// CREATE PAGE
exports.getCreatePage = (req, res) => {
    return res.render("admin/editArticle", {
        article: null,
        pageTitle: "Create Article",
        mode: "create",
    });
};

// CREATE ARTICLE
exports.createArticle = async (req, res) => {
    try {
        let {
            title,
            summary,
            content,
            author,
            category,
            image,
            source_url,
        } = req.body;

        const slug = slugify(title, {
            lower: true,
            strict: true,
        });

        await Article.create({
            title,
            slug,
            summary,
            content,
            author: author || "Sentinova Staff",
            category: category || "General",
            image,
            source_url,
            isPublished: true,
            publishedAt: new Date(),
        });

        return res.redirect("/admin/dashboard");
    } catch (error) {
        console.error("Create Article Error:", error);
        return res.status(500).render("error", {
            message: "Unable to create article",
        });
    }
};

// EDIT PAGE
exports.getEditPage = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);

        if (!article) {
            return res.status(404).render("404", {
                message: "Article not found",
            });
        }

        return res.render("admin/editArticle", {
            article,
            pageTitle: "Edit Article",
            mode: "edit",
        });
    } catch (error) {
        console.error("Get Edit Page Error:", error);
        return res.status(500).render("error", {
            message: "Unable to load edit page",
        });
    }
};

// UPDATE ARTICLE
exports.updateArticle = async (req, res) => {
    try {
        const {
            title,
            summary,
            content,
            author,
            category,
            image,
            source_url,
            isPublished,
        } = req.body;

        const article = await Article.findByPk(req.params.id);

        if (!article) {
            return res.status(404).render("404", {
                message: "Article not found",
            });
        }

        const newSlug = slugify(title, {
            lower: true,
            strict: true,
        });

        await article.update({
            title,
            slug: newSlug,
            summary,
            content,
            author,
            category,
            image,
            source_url,
            isPublished: isPublished === "on",
        });

        return res.redirect("/admin/dashboard");
    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).render("error", {
            message: "Unable to update article",
        });
    }
};

// DELETE ARTICLE
exports.deleteArticle = async (req, res) => {
    try {
        await Article.destroy({
            where: {
                id: req.params.id,
            },
        });

        return res.redirect("/admin/dashboard");
    } catch (error) {
        console.error("Delete Error:", error);
        return res.status(500).render("error", {
            message: "Unable to delete article",
        });
    }
};