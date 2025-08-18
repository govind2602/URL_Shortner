const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey"; // Use .env in production

// Create JWT from user object
function setUser(user) {
    // Only store minimal info in the token (e.g., userId)
    return jwt.sign(
        { id: user._id },
        SECRET_KEY,
        { expiresIn: "1d" } // 1 day expiry
    );
}

// Verify JWT and return userId
function getUser(token) {
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded.id; // userId
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return null;
    }
}

module.exports = {
    setUser,
    getUser
};
