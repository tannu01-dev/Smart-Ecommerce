const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleWare");

const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const router = express.Router();


// =====================================
// GET CATEGORIES
// User + Seller + Admin
// =====================================

router.get(
    "/",
    protect,
    getCategories
);


// =====================================
// CREATE CATEGORY
// Admin Only
// =====================================

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createCategory
);


// =====================================
// UPDATE CATEGORY
// Admin Only
// =====================================

router.put(
    "/:categoryId",
    protect,
    authorizeRoles("admin"),
    updateCategory
);


// =====================================
// DELETE CATEGORY
// Admin Only
// =====================================

router.delete(
    "/:categoryId",
    protect,
    authorizeRoles("admin"),
    deleteCategory
);


module.exports = router;