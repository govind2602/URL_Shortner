const User = require("../models/user");
const { getUser } = require("../service/auth");


//authorization

function checkforAuthorization(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer "))
        return next();

    const token = authorization.split(" ")[1];
    const user = getUser(token);

    req.user = user;
    return next();

}
// Middleware to restrict access to logged-in users only
async function restrictToLoggedInOnly(req, res, next) {
    const userUid = req.cookies?.uid;

    // Allow access to login and signup pages without redirect loops
    if (!userUid) {
        if (req.path === "/login" || req.path === "/signup") {
            return next();
        }
        return res.redirect("/login");
    }

    const userId = getUser(userUid); // Extract user ID from token/cookie
    if (!userId) {
        res.clearCookie("uid");
        if (req.path === "/login" || req.path === "/signup") {
            return next();
        }
        return res.redirect("/login");
    }

    const user = await User.findById(userId);
    if (!user) {
        res.clearCookie("uid");
        if (req.path === "/login" || req.path === "/signup") {
            return next();
        }
        return res.redirect("/login");
    }

    req.user = user;
    next();
}

// Middleware to check authentication (optional login)
async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;
    if (!userUid) return next();

    const userId = getUser(userUid);
    if (!userId) return next();

    const user = await User.findById(userId);
    if (user) req.user = user;

    next();
}

module.exports = { restrictToLoggedInOnly, checkAuth };
