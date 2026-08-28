const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleWare");

const {
    getAllUsers,
    getUsers,
    getSellers,
    blockUser,
    unblockUser,
    deleteUser
} = require("../controllers/adminUserController");

router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllUsers
);

router.get(
    "/users",
    protect,
    authorizeRoles("admin"),
    getUsers
);

router.get(
    "/sellers",
    protect,
    authorizeRoles("admin"),
    getSellers
);

router.put(
    "/:userId/block",
    protect,
    authorizeRoles("admin"),
    blockUser
);

router.put(
    "/:userId/unblock",
    protect,
    authorizeRoles("admin"),
    unblockUser
);

router.delete(
    "/:userId",
    protect,
    authorizeRoles("admin"),
    deleteUser
);


module.exports = router;