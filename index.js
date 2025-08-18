require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

// DB connection
const connectDB = require("./connect");

// Routes
const urlRoutes = require("./routes/url");
const userRoutes = require("./routes/user");
const staticRouter = require("./routes/staticRouter");

// Middleware
const { restrictToLoggedInOnly, checkAuth } = require("./middlewares/auth");

// Models
const Url = require("./models/url");

const app = express();
const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// View engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// 🔹 Protected home/dashboard
app.get("/", restrictToLoggedInOnly, async (req, res) => {
    try {
        const allUrls = await Url.find({ createdBy: req.user._id });
        const host = req.protocol + "://" + req.get("host");
        res.render("home", { urls: allUrls, host, user: req.user });
    } catch (err) {
        console.error("Error loading home:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 🔹 Public auth pages
app.use("/", checkAuth, staticRouter);

// 🔹 Auth actions (signup, login post requests)
app.use("/user", userRoutes);

// 🔹 URL routes (protected)
app.use("/url", restrictToLoggedInOnly, urlRoutes);
// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie("uid"); // Remove the JWT cookie
    return res.redirect("/login"); // Redirect to login page
});


// 🔹 Short URL redirect
app.get("/:shortId", async (req, res) => {
    const { shortId } = req.params;
    try {
        const entry = await Url.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true }
        );
        if (!entry) {
            return res.status(404).send("Short URL not found");
        }
        res.redirect(entry.redirectUrl);
    } catch (err) {
        console.error("Redirect error:", err);
        res.status(500).send("Server error");
    }
});

// DB connection & server start
connectDB(MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
    });
