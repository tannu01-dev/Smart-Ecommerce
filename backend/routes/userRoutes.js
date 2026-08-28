const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleWare");

const {
    getProducts
} = require("../controllers/productController");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const router = express.Router();


// REGISTER
router.post("/register", registerUser);


// LOGIN
router.post("/login", loginUser);


// USER PROFILE
router.get(
    "/profile",
    protect,
    authorizeRoles("user"),
    (req, res) => {

        res.json({
            success: true,
            message: "Protected profile accessed",
            user: req.user
        });

    }
);


// PRODUCTS
router.get("/products", getProducts);


module.exports = router;