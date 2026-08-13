const express = require("express");
const path = require("path");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const http = require("http");
const cookieParser = require("cookie-parser");

const { sequelize } = require("./config/db");
const { redis } = require("./config/redisClient");

// Load environment variables
dotenv.config();
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);

const app = express();
const server = http.createServer(app);

// =================================
// SOCKET.IO
// =================================

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set("io", io);

// =================================
// SECURITY MIDDLEWARE
// =================================

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://unpkg.com"
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com"
                ],
                fontSrc: [
                    "'self'",
                    "https://fonts.gstatic.com"
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "https:"
                ]
            }
        }
    })
);

app.use(
    cors({
        origin: "*",
        credentials: true
    })
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

// =================================
// BODY PARSER
// =================================

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =================================
// STATIC FILES
// =================================

app.use(express.static(path.join(__dirname, "public")));

// =================================
// SESSION
// =================================

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false
        }
    })
);

// =================================
// VIEW ENGINE
// =================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/layout");

// =================================
// GLOBAL USER VARIABLE
// =================================

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// =================================
// REDIS HEALTH CHECK
// =================================

redis
    .ping()
    .then(() => {
        console.log("✅ Redis is ready");
    })
    .catch((err) => {
        console.error("❌ Redis connection failed:", err.message);
    });
app.use(cookieParser());
// =================================
// ROUTES
// =================================

const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/", articleRoutes);
app.use("/auth", authRoutes);

// =================================
// NEWS FETCH CRON JOB
// =================================

try {
    const fetchNews = require("./scripts/fetchNews");

    cron.schedule("0 * * * *", async () => {
        try {
            const inserted = await fetchNews();

            if (inserted > 0) {
                io.emit("newsUpdated", {
                    count: inserted,
                    message: `${inserted} new articles added`
                });
            }
        } catch (err) {
            console.error(err);
        }
    });
} catch (err) {
    console.log("⚠️ fetchNews service not configured yet.");
}

// =================================
// SOCKET EVENTS
// =================================

io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// =================================
// 404 PAGE
// =================================

app.use((req, res) => {
    res.status(404).render("404", {
        pageTitle: "Page Not Found"
    });
});

// =================================
// ERROR HANDLER
// =================================

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    res.status(500).render("error", {
        pageTitle: "Error",
        message: "Internal Server Error"
    });
});


// =================================
// DATABASE CONNECTION
// =================================

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
    sequelize
        .authenticate()
        .then(async () => {
            console.log("✅ Connected to MySQL database");

            server.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error("❌ Database connection failed:", err);
        });
}

// Export app for Jest testing
module.exports = app;