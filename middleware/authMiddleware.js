const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.redirect("/auth/login");
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        // Make available in EJS
        res.locals.user = decoded;

        next();
    } catch (err) {
        return res.redirect("/auth/login");
    }
};

exports.adminOnly = (req, res, next) => {
    if (
        req.user &&
        (req.user.role === "admin" ||
            req.user.role === "editor")
    ) {
        return next();
    }

    return res.status(403).render("error", {
        pageTitle: "Access Denied",
        message: "You do not have permission to access this page."
    });
};