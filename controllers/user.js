const User = require("../models/user");
const { setUser } = require("../service/auth");

// Signup Controller
async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup", { error: "Email already registered" });
        }

        // Create user
        await User.create({ name, email, password });

        // Redirect to login after signup
        return res.redirect("/login");
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}

// Login Controller
async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        // Find user by email & password
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.render("login", { error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = setUser(user);

        // Set cookie
        res.cookie("uid", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        // Redirect to home
        return res.redirect("/");
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}

// Logout Controller
function handleUserLogout(req, res) {
    res.clearCookie("uid");
    res.redirect("/login");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout,
};
