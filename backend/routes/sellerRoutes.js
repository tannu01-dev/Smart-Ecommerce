const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleWare");

const {
    getSellerDashboard,
    createProduct,
    getProducts,
    getSellerProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/sellerController");


// =====================================
// SELLER DASHBOARD
// =====================================

router.get(
    "/dashboard",
    protect,
    authorizeRoles("seller"),
    getSellerDashboard
);


// =====================================
// CREATE PRODUCT
// =====================================

router.post(
    "/products",
    protect,
    authorizeRoles("seller"),
    createProduct
);


// =====================================
// SELLER MY PRODUCTS
// =====================================

router.get(
    "/products",
    protect,
    authorizeRoles("seller"),
    getSellerProducts
);


// =====================================
// UPDATE PRODUCT
// =====================================

router.put(
    "/products/:productId",
    protect,
    authorizeRoles("seller"),
    updateProduct
);


// =====================================
// DELETE PRODUCT
// =====================================

router.delete(
    "/products/:productId",
    protect,
    authorizeRoles("seller"),
    deleteProduct
);


// =====================================
// EXPORT
// =====================================

module.exports = router;