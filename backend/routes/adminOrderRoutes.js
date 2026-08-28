const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleWare");
const authorizePermission = require("../middleware/permissionMiddleWare");

const {
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();


// ===============================
// GET ALL ORDERS
// ===============================

router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    authorizePermission("orders"),
    getAllOrders
);


// ===============================
// UPDATE ORDER STATUS
// ===============================

router.put(
    "/:id/status",
    protect,
    authorizeRoles("admin"),
    authorizePermission("orders"),
    updateOrderStatus
);


module.exports = router;