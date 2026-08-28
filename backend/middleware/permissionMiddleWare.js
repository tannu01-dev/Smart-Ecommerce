const permissions = require("../config/permissions");

const authorizePermission = (requiredPermission) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.adminRole;

            if (!userRole) {
                return res.status(403).json({
                    success: false,
                    message: "Admin role not found"
                });
            }

            const allowedPermissions = permissions[userRole];

            if (!allowedPermissions) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid admin role"
                });
            }

            if (
                allowedPermissions.includes("*") ||
                allowedPermissions.includes(requiredPermission)
            ) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
};

module.exports = authorizePermission;