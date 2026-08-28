const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Category = require("../models/Category");


// =====================================
// GET PENDING PRODUCTS
// =====================================

const getPendingProducts = async (req, res) => {
    try {

        const products = await Product.find({
            status: "pending"
        })
            .populate("seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================
// APPROVE PRODUCT
// =====================================

const approveProduct = async (req, res) => {
    try {

        const { productId } = req.params;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.status = "approved";
        product.rejectionReason = null;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product approved successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================
// REJECT PRODUCT
// =====================================

const rejectProduct = async (req, res) => {
    try {

        const { productId } = req.params;
        const { reason } = req.body;

        if (!reason || reason.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.status = "rejected";
        product.rejectionReason = reason.trim();

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product rejected",
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================
// GET ALL ORDERS
// =====================================

const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name")
            .populate("items.seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================
// GET ALL USERS
// =====================================

const getAllUsers = async (req, res) => {
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

        console.log("GET USERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================
// GET ALL SELLERS
// =====================================

const getAllSellers = async (req, res) => {
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

        console.log("GET SELLERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================
// BLOCK / UNBLOCK USER OR SELLER
// =====================================

const toggleBlockUser = async (req, res) => {
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

        user.isBlocked = !user.isBlocked;

        await user.save();

        res.status(200).json({
            success: true,
            message: user.isBlocked
                ? "User blocked successfully"
                : "User unblocked successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked
            }
        });

    } catch (error) {

        console.log("BLOCK USER ERROR:", error);

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

        // Admin delete nahi karna
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

        console.log("DELETE USER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// =====================================
// GET ALL PRODUCTS
// =====================================

const getAllProducts = async (req, res) => {
    try {

        const products = await Product.find()
            .populate("seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        console.log("GET ALL PRODUCTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// =====================================
// GET ALL CATEGORIES
// =====================================

const getAllCategories = async (req, res) => {
    try {

        const categories = await Category.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {

        console.log("GET CATEGORIES ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// =====================================
// CREATE CATEGORY
// =====================================

const createCategory = async (req, res) => {
    try {

        const { name, description } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim()
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description || ""
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {

        console.log("CREATE CATEGORY ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// UPDATE CATEGORY
// =====================================

const updateCategory = async (req, res) => {
    try {

        const { categoryId } = req.params;
        const { name, description } = req.body;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (name && name.trim() !== "") {
            category.name = name.trim();
        }

        if (description !== undefined) {
            category.description = description;
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {

        console.log("UPDATE CATEGORY ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// DELETE CATEGORY
// =====================================

const deleteCategory = async (req, res) => {
    try {

        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {

        console.log("DELETE CATEGORY ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// =====================================
// GET ANALYTICS
// =====================================

const getAnalytics = async (req, res) => {
    try {

        const { period = "monthly" } = req.query;

        // =====================================
        // DATE FILTER
        // =====================================

        const now = new Date();

        let startDate = new Date();

        if (period === "weekly") {

            startDate.setDate(
                now.getDate() - 7
            );

        } else if (period === "yearly") {

            startDate.setFullYear(
                now.getFullYear() - 1
            );

        } else {

            // monthly
            startDate.setMonth(
                now.getMonth() - 1
            );
        }


        // =====================================
        // ORDERS
        // =====================================

        const orders = await Order.find({
            createdAt: {
                $gte: startDate,
                $lte: now
            }
        })
            .populate("user", "name email")
            .populate("items.product", "name")
            .populate("items.seller", "name email");


        // =====================================
        // TOTAL ORDERS
        // =====================================

        const totalOrders =
            orders.length;


        // =====================================
        // COMPLETED ORDERS
        // =====================================

        const completedOrders =
            orders.filter(
                order =>
                    order.orderStatus === "delivered"
            ).length;


        // =====================================
        // TOTAL REVENUE
        // =====================================

        const completedOrderList =
            orders.filter(
                order =>
                    order.orderStatus === "delivered"
            );


        const totalRevenue =
            completedOrderList.reduce(
                (total, order) =>
                    total + Number(order.totalAmount || 0),
                0
            );


        // =====================================
        // REFUND AMOUNT
        // =====================================

        const refundAmount =
            orders
                .filter(
                    order =>
                        order.paymentStatus === "refunded" ||
                        order.orderStatus === "returned"
                )
                .reduce(
                    (total, order) =>
                        total + Number(order.totalAmount || 0),
                    0
                );


        // =====================================
        // TOP PRODUCTS
        // =====================================

        const productMap = {};


        completedOrderList.forEach(order => {

            order.items.forEach(item => {

                const productId =
                    item.product?._id?.toString() ||
                    item.product?.toString();


                const productName =
                    item.name || "Unknown Product";


                if (!productMap[productId]) {

                    productMap[productId] = {

                        name: productName,

                        sales: 0,

                        revenue: 0

                    };

                }


                productMap[productId].sales +=
                    Number(item.quantity || 0);


                productMap[productId].revenue +=
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

            });

        });


        const topProducts =
            Object.values(productMap)
                .sort(
                    (a, b) =>
                        b.sales - a.sales
                )
                .slice(0, 5);


        // =====================================
        // TOP SELLERS
        // =====================================

        const sellerMap = {};


        completedOrderList.forEach(order => {

            order.items.forEach(item => {

                const sellerId =
                    item.seller?._id?.toString() ||
                    item.seller?.toString();


                const sellerName =
                    item.seller?.name ||
                    "Unknown Seller";


                if (!sellerMap[sellerId]) {

                    sellerMap[sellerId] = {

                        name: sellerName,

                        orders: 0,

                        revenue: 0

                    };

                }


                sellerMap[sellerId].orders += 1;


                sellerMap[sellerId].revenue +=
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

            });

        });


        const topSellers =
            Object.values(sellerMap)
                .sort(
                    (a, b) =>
                        b.revenue - a.revenue
                )
                .slice(0, 5);


        // =====================================
        // MONTHLY REVENUE
        // =====================================

        const monthlyRevenue = {};

        completedOrderList.forEach(order => {

            const date =
                new Date(order.createdAt);

            const month =
                date.toLocaleString(
                    "en-IN",
                    {
                        month: "short"
                    }
                );


            if (!monthlyRevenue[month]) {

                monthlyRevenue[month] = 0;

            }


            monthlyRevenue[month] +=
                Number(order.totalAmount || 0);

        });


        const sales =
            Object.entries(monthlyRevenue)
                .map(
                    ([month, revenue]) => ({
                        month,
                        revenue
                    })
                );


        // =====================================
        // RESPONSE
        // =====================================

        res.status(200).json({

            success: true,

            period,

            stats: {

                totalRevenue,

                totalOrders,

                completedOrders,

                refundAmount

            },

            sales,

            topProducts,

            topSellers

        });


    } catch (error) {

        console.log(
            "GET ANALYTICS ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }
};
const getReports = async (req, res) => {
    try {

        const { type, from, to } = req.query;

        // =================================
        // DATE FILTER
        // =================================

        let dateFilter = {};

        if (from || to) {

            dateFilter.createdAt = {};

            if (from) {
                dateFilter.createdAt.$gte =
                    new Date(`${from}T00:00:00.000Z`);
            }

            if (to) {
                dateFilter.createdAt.$lte =
                    new Date(`${to}T23:59:59.999Z`);
            }
        }


        // =================================
        // SALES REPORT
        // =================================

        if (type === "Sales") {

            const orders = await Order.find({
                ...dateFilter,
                orderStatus: "delivered"
            });


            const totalSales = orders.reduce(
                (sum, order) =>
                    sum + Number(order.totalAmount || 0),
                0
            );


            const totalOrders = orders.length;


            const productsSold = orders.reduce(
                (total, order) => {

                    const quantity =
                        order.items?.reduce(
                            (sum, item) =>
                                sum +
                                Number(item.quantity || 0),
                            0
                        ) || 0;

                    return total + quantity;

                },
                0
            );


            return res.status(200).json({

                success: true,

                type: "Sales",

                report: {

                    totalSales,

                    totalOrders,

                    productsSold

                }

            });

        }


        // =================================
        // ORDERS REPORT
        // =================================

        if (type === "Orders") {

            const orders =
                await Order.find(dateFilter);


            const completed =
                orders.filter(
                    order =>
                        order.orderStatus === "delivered"
                ).length;


            const cancelled =
                orders.filter(
                    order =>
                        order.orderStatus === "cancelled"
                ).length;


            const pending =
                orders.filter(
                    order =>
                        order.orderStatus === "pending"
                ).length;


            return res.status(200).json({

                success: true,

                type: "Orders",

                report: {

                    totalOrders:
                        orders.length,

                    completed,

                    cancelled,

                    pending

                }

            });

        }


        // =================================
        // PRODUCTS REPORT
        // =================================

        if (type === "Products") {

            const products =
                await Product.find(dateFilter);


            const approved =
                products.filter(
                    product =>
                        product.status === "approved"
                ).length;


            const pending =
                products.filter(
                    product =>
                        product.status === "pending"
                ).length;


            const rejected =
                products.filter(
                    product =>
                        product.status === "rejected"
                ).length;


            return res.status(200).json({

                success: true,

                type: "Products",

                report: {

                    totalProducts:
                        products.length,

                    approved,

                    pending,

                    rejected

                }

            });

        }


        // =================================
        // SELLERS REPORT
        // =================================

        if (type === "Sellers") {

            const sellers =
                await User.find({
                    role: "seller",
                    ...dateFilter
                }).select("-password");


            const activeSellers =
                sellers.filter(
                    seller =>
                        seller.isBlocked !== true
                ).length;


            // -----------------------------
            // SELLER REVENUE
            // -----------------------------

            const orders =
                await Order.find({
                    ...dateFilter,
                    orderStatus: "delivered"
                });


            const sellerRevenue = {};


            orders.forEach(order => {

                order.items?.forEach(item => {

                    if (!item.seller) {
                        return;
                    }


                    const sellerId =
                        item.seller.toString();


                    const revenue =
                        Number(item.price || 0) *
                        Number(item.quantity || 0);


                    sellerRevenue[sellerId] =
                        (sellerRevenue[sellerId] || 0)
                        + revenue;

                });

            });


            let topSeller = "N/A";

            let highestRevenue = 0;


            for (
                const sellerId in sellerRevenue
            ) {

                if (
                    sellerRevenue[sellerId]
                    > highestRevenue
                ) {

                    highestRevenue =
                        sellerRevenue[sellerId];


                    const seller =
                        sellers.find(
                            seller =>
                                seller._id.toString()
                                === sellerId
                        );


                    if (seller) {

                        topSeller =
                            seller.name;

                    }

                }

            }


            const totalSellerRevenue =
                Object.values(sellerRevenue)
                    .reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    );


            return res.status(200).json({

                success: true,

                type: "Sellers",

                report: {

                    totalSellers:
                        sellers.length,

                    activeSellers,

                    topSeller,

                    sellerRevenue:
                        totalSellerRevenue

                }

            });

        }


        // =================================
        // INVALID TYPE
        // =================================

        return res.status(400).json({

            success: false,

            message:
                "Invalid report type"

        });


    } catch (error) {

        console.log(
            "GET REPORTS ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }
};

// =====================================
// EXPORTS
// =====================================

module.exports = {

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

};