const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleWare");
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    getSellerOrders,
    updateOrderStatus
} = require("../controllers/orderController");
// =====================================
// USER → CREATE ORDER
// =====================================
router.post(
    "/",
    protect,
    authorizeRoles("user"),
    createOrder
);
// =====================================
// USER → MY ORDERS
// =====================================
router.get(
    "/",
    protect,
    authorizeRoles("user"),
    getMyOrders
);
// =====================================
// ADMIN → ALL ORDERS
// =====================================
router.get(
    "/all",
    protect,
    authorizeRoles("admin"),
    getAllOrders
);


// =====================================
// SELLER → GET ORDERS
// =====================================

router.get(
    "/seller-orders",
    protect,
    authorizeRoles("seller"),
    getSellerOrders
);


// =====================================
// SELLER → UPDATE ORDER STATUS
// =====================================

router.put(
    "/seller-orders/:orderId",
    protect,
    authorizeRoles("seller"),
    updateOrderStatus
);


module.exports = router;

