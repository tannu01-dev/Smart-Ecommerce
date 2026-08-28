const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleWare");

const {
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCoupon
} = require("../controllers/couponController");

const router = express.Router();


// =====================================
// GET ALL COUPONS
// =====================================

router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllCoupons
);


// =====================================
// CREATE COUPON
// =====================================

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createCoupon
);


// =====================================
// UPDATE COUPON
// =====================================

router.put(
    "/:couponId",
    protect,
    authorizeRoles("admin"),
    updateCoupon
);


// =====================================
// DELETE COUPON
// =====================================

router.delete(
    "/:couponId",
    protect,
    authorizeRoles("admin"),
    deleteCoupon
);


// =====================================
// TOGGLE COUPON
// =====================================

router.put(
    "/:couponId/toggle",
    protect,
    authorizeRoles("admin"),
    toggleCoupon
);


module.exports = router;

