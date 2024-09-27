const jwt = require("jsonwebtoken");
const User = require("../models/User");



exports.validateToken = async (req, res, next) => {

    const token = req.headers.authorization;
    if (!token) {
        return res.status(502).json({
            message: "Unauthorized"
        })
    }
    try {
        const data = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({ username: data.username })
        req.user = user;
        next();
    }
    catch (e) {
        console.log(e)
        if (e.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Token expired. Please re-login" });
        }
        if (e.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token. Please re-login" });
        }
        return res.status(403).json({ message: "An issue occurred with the token" });

    }
}