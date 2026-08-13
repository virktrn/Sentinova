// controllers/authController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// =======================================
// Generate JWT Token
// =======================================
const createToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
};

// =======================================
// GET LOGIN PAGE
// =======================================
exports.getLoginPage = (req, res) => {
    res.render("auth/login", {
        pageTitle: "Login",
    });
};

// =======================================
// GET REGISTER PAGE
// =======================================
exports.getRegisterPage = (req, res) => {
    res.render("auth/register", {
        pageTitle: "Register",
    });
};

// =======================================
// REGISTER USER
// =======================================
exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("auth/register", {
                pageTitle: "Register",
                errors: errors.array(),
            });
        }

        const { name, email, password } = req.body;

        let user = await User.findOne({
            where: { email },
        });

        if (user) {
            return res.status(400).render("auth/register", {
                pageTitle: "Register",
                error: "Email already exists",
            });
        }

        user = await User.create({
            name,
            email,
            password,
            role: "reader",
        });

// After registration, send user to login page
        res.redirect("/auth/login");
    } catch (err) {
        console.error("Register Error:", err);
        next(err);
    }
};

// =======================================
// LOGIN USER
// =======================================
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).render("auth/login", {
                pageTitle: "Login",
                error: "Invalid email or password",
            });
        }

        const token = createToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error("Login Error:", err);
        next(err);
    }
};

// =======================================
// LOGOUT
// =======================================
exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};