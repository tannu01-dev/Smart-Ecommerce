const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleWare");

const {
    getAdminDashboard
} = require("../controllers/adminDashboardController");


// =====================================
// ADMIN DASHBOARD
// =====================================

router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAdminDashboard
);


module.exports = router;