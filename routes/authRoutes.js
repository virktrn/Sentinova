const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const authController = require("../controllers/authController");

// ============================
// PAGES
// ============================

router.get("/login", authController.getLoginPage);
router.get("/register", authController.getRegisterPage);

// ============================
// REGISTER
// ============================

router.post(
    "/register",

    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),

    body("email")
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    authController.register
);

// ============================
// LOGIN
// ============================

router.post(
    "/login",

    body("email")
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    authController.login
);

// ============================
// LOGOUT
// ============================

router.get("/logout", authController.logout);

module.exports = router;