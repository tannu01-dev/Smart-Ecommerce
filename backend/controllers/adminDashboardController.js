const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");


// =====================================
// ADMIN DASHBOARD
// =====================================

const getAdminDashboard = async (req, res) => {
    try {

        // ================================
        // USERS
        // ================================

        const totalUsers = await User.countDocuments({
            role: "user"
        });

        const totalSellers = await User.countDocuments({
            role: "seller"
        });


        // ================================
        // PRODUCTS
        // ================================

        const totalProducts = await Product.countDocuments();

        const pendingProducts = await Product.countDocuments({
            status: "pending"
        });

        const approvedProducts = await Product.countDocuments({
            status: "approved"
        });

        const rejectedProducts = await Product.countDocuments({
            status: "rejected"
        });


        // ================================
        // ORDERS
        // ================================

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "pending"
        });

        const confirmedOrders = await Order.countDocuments({
            orderStatus: "confirmed"
        });

        const processingOrders = await Order.countDocuments({
            orderStatus: "processing"
        });

        const shippedOrders = await Order.countDocuments({
            orderStatus: "shipped"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            orderStatus: "cancelled"
        });


        // ================================
        // TOTAL REVENUE
        // ================================

        const paidOrders = await Order.find({
            paymentStatus: "paid",
            orderStatus: {
                $nin: ["cancelled", "returned"]
            }
        });

        let totalRevenue = 0;

        paidOrders.forEach((order) => {
            totalRevenue += order.totalAmount;
        });


        // ================================
        // MONTHLY REVENUE
        // ================================

        const currentYear = new Date().getFullYear();

        const monthlyRevenue = Array(12).fill(0);

        paidOrders.forEach((order) => {

            const date = new Date(order.createdAt);

            if (date.getFullYear() === currentYear) {

                const month = date.getMonth();

                monthlyRevenue[month] += order.totalAmount;

            }

        });


        // ================================
        // RECENT ORDERS
        // ================================

        const recentOrders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name")
            .sort({ createdAt: -1 })
            .limit(5);


        // ================================
        // RECENT PRODUCTS
        // ================================

        const recentProducts = await Product.find()
            .populate("seller", "name email")
            .sort({ createdAt: -1 })
            .limit(5);


        // ================================
        // RESPONSE
        // ================================

        res.status(200).json({

            success: true,

            stats: {

                totalUsers,
                totalSellers,

                totalProducts,
                pendingProducts,
                approvedProducts,
                rejectedProducts,

                totalOrders,
                pendingOrders,
                confirmedOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,

                totalRevenue,

                monthlyRevenue

            },

            recentOrders,

            recentProducts

        });

    } catch (error) {

        console.log(
            "ADMIN DASHBOARD ERROR:",
            error
        );

        res.status(500).json({

            success: false,
            message: error.message

        });

    }
};


module.exports = {
    getAdminDashboard
};