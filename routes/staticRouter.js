const express = require("express");
const { restrictToLoggedInOnly, checkAuth } = require("../middlewares/auth");
const Url = require("../models/url");

const router = express.Router();

// Protected home page
router.get("/", restrictToLoggedInOnly, async (req, res) => {
    try {
        let allUrls = [];
        if (req.user && req.user._id) {
            allUrls = await Url.find({ createdBy: req.user._id });
        }
        const host = req.protocol + "://" + req.get("host");
        res.render("home", { urls: allUrls, host, user: req.user });
    } catch (err) {
        console.error("Error fetching URLs:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Public signup page
router.get("/signup", checkAuth, (req, res) => {
    if (req.user) return res.redirect("/"); // If already logged in
    res.render("signup", { error: null });
});

// Public login page
router.get("/login", checkAuth, (req, res) => {
    if (req.user) return res.redirect("/");
    res.render("login", { error: null });
});

module.exports = router;
