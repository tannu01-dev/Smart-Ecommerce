const User = require("../models/User");


// =====================================
// GET ALL USERS + SELLERS
// =====================================

const getAllUsers = async (req, res) => {
    try {

        const users = await User.find({
            role: {
                $in: ["user", "seller"]
            }
        })
            .select("-password")
            .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        console.log(
            "GET ALL USERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// GET ONLY USERS
// =====================================

const getUsers = async (req, res) => {
    try {

        const users = await User.find({
            role: "user"
        })
            .select("-password")
            .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        console.log(
            "GET USERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// GET ONLY SELLERS
// =====================================

const getSellers = async (req, res) => {
    try {

        const sellers = await User.find({
            role: "seller"
        })
            .select("-password")
            .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            count: sellers.length,
            sellers
        });

    } catch (error) {

        console.log(
            "GET SELLERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// BLOCK USER / SELLER
// =====================================

const blockUser = async (req, res) => {
    try {

        const { userId } = req.params;


        const user = await User.findById(userId);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // Admin ko block nahi karna
        if (user.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin cannot be blocked"
            });
        }


        user.isBlocked = true;

        await user.save();


        res.status(200).json({
            success: true,
            message: "User blocked successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked
            }
        });

    } catch (error) {

        console.log(
            "BLOCK USER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// UNBLOCK USER / SELLER
// =====================================

const unblockUser = async (req, res) => {
    try {

        const { userId } = req.params;


        const user = await User.findById(userId);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        user.isBlocked = false;

        await user.save();


        res.status(200).json({
            success: true,
            message: "User unblocked successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked
            }
        });

    } catch (error) {

        console.log(
            "UNBLOCK USER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// DELETE USER / SELLER
// =====================================

const deleteUser = async (req, res) => {
    try {

        const { userId } = req.params;


        const user = await User.findById(userId);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // Admin ko delete nahi karna
        if (user.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin cannot be deleted"
            });
        }


        await User.findByIdAndDelete(userId);


        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        console.log(
            "DELETE USER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUsers,
    getSellers,
    blockUser,
    unblockUser,
    deleteUser
};