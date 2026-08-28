const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleWare");

const {
    getAllReturns,
    approveReturn,
    rejectReturn,
    completeRefund
} = require("../controllers/returnController");

const router = express.Router();


// =====================================
// GET ALL RETURNS
// =====================================

router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllReturns
);


// =====================================
// APPROVE RETURN
// =====================================

router.put(
    "/:returnId/approve",
    protect,
    authorizeRoles("admin"),
    approveReturn
);


// =====================================
// REJECT RETURN
// =====================================

router.put(
    "/:returnId/reject",
    protect,
    authorizeRoles("admin"),
    rejectReturn
);


// =====================================
// COMPLETE REFUND
// =====================================

router.put(
    "/:returnId/refund",
    protect,
    authorizeRoles("admin"),
    completeRefund
);


module.exports = router;