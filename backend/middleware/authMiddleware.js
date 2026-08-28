const jwt = require("jsonwebtoken");
const User = require("../models/User");



const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Blocked user check
        if (user.isBlocked === true) {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked"
            });
        }

        console.log("AUTH USER:", {
    id: user._id,
    email: user.email,
    role: user.role
});

        req.user = user;

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;