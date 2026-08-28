const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleWare");

const {
    getPendingProducts,
    approveProduct,
    rejectProduct,

    getAllOrders,

    getAllUsers,
    getAllSellers,
    toggleBlockUser,
    deleteUser,

    getAllProducts,

    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,

    getAnalytics,
    getReports
} = require("../controllers/adminController");

const router = express.Router();


// =====================================
// ALL ADMIN ROUTES
// =====================================


// =====================================
// PRODUCTS
// =====================================

// Get All Products
router.get(
    "/products",
    protect,
    authorizeRoles("admin"),
    getAllProducts
);


// Get Pending Products
router.get(
    "/products/pending",
    protect,
    authorizeRoles("admin"),
    getPendingProducts
);


// Approve Product
router.put(
    "/products/:productId/approve",
    protect,
    authorizeRoles("admin"),
    approveProduct
);


// Reject Product
router.put(
    "/products/:productId/reject",
    protect,
    authorizeRoles("admin"),
    rejectProduct
);


// =====================================
// ORDERS
// =====================================

router.get(
    "/orders",
    protect,
    authorizeRoles("admin"),
    getAllOrders
);


// =====================================
// ANALYTICS
// =====================================

router.get(
    "/analytics",
    protect,
    authorizeRoles("admin"),
    getAnalytics
);


// =====================================
// REPORTS
// =====================================

router.get(
    "/reports",
    protect,
    authorizeRoles("admin"),
    getReports
);


// =====================================
// USERS
// =====================================

// Get All Users
router.get(
    "/users",
    protect,
    authorizeRoles("admin"),
    getAllUsers
);


// Get All Sellers
router.get(
    "/sellers",
    protect,
    authorizeRoles("admin"),
    getAllSellers
);


// Block / Unblock User or Seller
router.put(
    "/users/:userId/block",
    protect,
    authorizeRoles("admin"),
    toggleBlockUser
);


// Delete User / Seller
router.delete(
    "/users/:userId",
    protect,
    authorizeRoles("admin"),
    deleteUser
);


// =====================================
// CATEGORIES
// =====================================

// Get Categories
router.get(
    "/categories",
    protect,
    authorizeRoles("admin"),
    getAllCategories
);


// Create Category
router.post(
    "/categories",
    protect,
    authorizeRoles("admin"),
    createCategory
);


// Update Category
router.put(
    "/categories/:categoryId",
    protect,
    authorizeRoles("admin"),
    updateCategory
);


// Delete Category
router.delete(
    "/categories/:categoryId",
    protect,
    authorizeRoles("admin"),
    deleteCategory
);


module.exports = router;