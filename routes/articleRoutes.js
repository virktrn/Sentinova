const express = require("express");
const router = express.Router();

const articleController = require("../controllers/articleController");
console.log(Object.keys(articleController));
const authMiddleware = require("../middleware/authMiddleware");

// =========================
// PUBLIC ROUTES
// =========================

// Home Page – latest articles
router.get("/", articleController.homePage);

// View a single article
router.get("/article/:slug", articleController.viewArticle);

// Search
router.get("/search", articleController.search);

// =========================
// ADMIN ROUTES (protected)
// =========================

router.get(
    "/admin/dashboard",
    authMiddleware.protect,
    authMiddleware.adminOnly,
    articleController.adminDashboard
);

router.get(
    "/admin/create",
    authMiddleware.protect,
    authMiddleware.adminOnly,
    articleController.getCreatePage
);

router.post(
    "/admin/create",
    authMiddleware.protect,
    authMiddleware.adminOnly,
    articleController.createArticle
);

router.get(
    "/admin/edit/:id",
    authMiddleware.protect,
    authMiddleware.adminOnly,
    articleController.getEditPage
);

router.post(
    "/admin/edit/:id",
    authMiddleware.protect,
    authMiddleware.adminOnly,
    articleController.updateArticle
);

router.get(
    "/admin/delete/:id",
    authMiddleware.protect,
    authMiddleware.adminOnly,
    articleController.deleteArticle
);
module.exports = router;
