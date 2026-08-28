const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");


// =====================================
// SELLER DASHBOARD
// =====================================

const getSellerDashboard = async (req, res) => {
    try {

        const sellerId = req.user._id;

        const totalProducts = await Product.countDocuments({
            seller: sellerId
        });

        const pendingProducts = await Product.countDocuments({
            seller: sellerId,
            status: "pending"
        });

        const approvedProducts = await Product.countDocuments({
            seller: sellerId,
            status: "approved"
        });

        const orders = await Order.find({
            "items.seller": sellerId
        });

        const totalOrders = orders.length;

        const pendingOrders = orders.filter(
            order => order.orderStatus === "pending"
        ).length;

        const confirmedOrders = orders.filter(
            order => order.orderStatus === "confirmed"
        ).length;

        const processingOrders = orders.filter(
            order => order.orderStatus === "processing"
        ).length;

        const shippedOrders = orders.filter(
            order => order.orderStatus === "shipped"
        ).length;

        const outForDeliveryOrders = orders.filter(
            order => order.orderStatus === "out_for_delivery"
        ).length;

        const deliveredOrders = orders.filter(
            order => order.orderStatus === "delivered"
        ).length;

        const cancelledOrders = orders.filter(
            order => order.orderStatus === "cancelled"
        ).length;


        // =====================================
        // SELLER REVENUE
        // =====================================

        let totalEarnings = 0;

        orders.forEach(order => {

            if (
                order.orderStatus === "cancelled" ||
                order.orderStatus === "returned"
            ) {
                return;
            }

            order.items.forEach(item => {

                if (
                    item.seller &&
                    item.seller.toString() === sellerId.toString()
                ) {
                    totalEarnings +=
                        Number(item.price) * Number(item.quantity);
                }

            });

        });


        // =====================================
        // MONTHLY SALES
        // =====================================

        const monthlySales = Array(12).fill(0);

        orders.forEach(order => {

            if (
                order.orderStatus === "cancelled" ||
                order.orderStatus === "returned"
            ) {
                return;
            }

            const month =
                new Date(order.createdAt).getMonth();

            order.items.forEach(item => {

                if (
                    item.seller &&
                    item.seller.toString() === sellerId.toString()
                ) {

                    monthlySales[month] +=
                        Number(item.price) * Number(item.quantity);

                }

            });

        });


        // =====================================
        // RECENT ORDERS
        // =====================================

        const recentOrders = await Order.find({
            "items.seller": sellerId
        })
            .populate("user", "name email")
            .populate("items.product", "name images price")
            .sort({ createdAt: -1 })
            .limit(5);


        res.status(200).json({

            success: true,

            stats: {
                totalProducts,
                pendingProducts,
                approvedProducts,

                totalOrders,

                pendingOrders,
                confirmedOrders,
                processingOrders,
                shippedOrders,
                outForDeliveryOrders,
                deliveredOrders,
                cancelledOrders,

                totalEarnings,
                monthlySales
            },

            recentOrders

        });

    } catch (error) {

        console.log(
            "SELLER DASHBOARD ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================
// SELLER → CREATE PRODUCT
// =====================================

const createProduct = async (req, res) => {

    try {

        const {
            name,
            description,
            images,
            image,
            price,
            category,
            stock
        } = req.body;


        if (
            !name ||
            !description ||
            price === undefined ||
            !category
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, description, price and category are required"
            });

        }


        // =====================================
        // CHECK CATEGORY
        // =====================================

        const categoryData =
            await Category.findById(category);

        if (!categoryData) {

            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });

        }


        // =====================================
        // IMAGE
        // =====================================

        let productImages = [];

        // Frontend se images array aaye
        if (Array.isArray(images)) {

            productImages = images
                .filter(
                    img =>
                        typeof img === "string" &&
                        img.trim() !== ""
                )
                .map(img => img.trim());

        }

        // Frontend se single image URL aaye
        if (
            productImages.length === 0 &&
            typeof image === "string" &&
            image.trim() !== ""
        ) {

            productImages = [
                image.trim()
            ];

        }


        // =====================================
        // CREATE PRODUCT
        // =====================================

        const product = await Product.create({

            name: name.trim(),

            description: description.trim(),

            price: Number(price),

            images: productImages,

            category: categoryData._id,

            stock: Number(stock) || 0,

            seller: req.user._id,

            status: "pending"

        });


        res.status(201).json({

            success: true,

            message:
                "Product created and sent for approval",

            product

        });

    } catch (error) {

        console.log(
            "CREATE PRODUCT ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// =====================================
// USER → GET APPROVED PRODUCTS
// =====================================

const getProducts = async (req, res) => {

    try {

        const products = await Product.find({
            status: "approved"
        })
            .populate("seller", "name email")
            .populate("category", "name")
            .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,

            count: products.length,

            products

        });

    } catch (error) {

        console.log(
            "GET PRODUCTS ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================
// SELLER → GET MY PRODUCTS
// =====================================

const getSellerProducts = async (req, res) => {

    try {

        const products = await Product.find({

            seller: req.user._id

        })
            .populate("seller", "name email")
            .populate("category", "name")
            .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,

            count: products.length,

            products

        });

    } catch (error) {

        console.log(
            "GET SELLER PRODUCTS ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================
// SELLER → UPDATE PRODUCT
// =====================================

const updateProduct = async (req, res) => {

    try {

        const { productId } = req.params;

        const {
            name,
            description,
            price,
            category,
            stock,
            images,
            image
        } = req.body;


        const product =
            await Product.findById(productId);


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }


        // =====================================
        // OWNERSHIP
        // =====================================

        if (
            product.seller.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to edit this product"

            });

        }


        // =====================================
        // UPDATE BASIC DATA
        // =====================================

        if (name !== undefined) {
            product.name = name.trim();
        }

        if (description !== undefined) {
            product.description = description.trim();
        }

        if (price !== undefined) {
            product.price = Number(price);
        }

        if (stock !== undefined) {
            product.stock = Number(stock);
        }


        // =====================================
        // CATEGORY
        // =====================================

        if (category !== undefined) {

            const categoryData =
                await Category.findById(category);

            if (!categoryData) {

                return res.status(400).json({

                    success: false,

                    message: "Invalid category"

                });

            }

            product.category =
                categoryData._id;

        }


        // =====================================
        // IMAGES
        // =====================================

        if (Array.isArray(images)) {

            product.images = images
                .filter(
                    img =>
                        typeof img === "string" &&
                        img.trim() !== ""
                )
                .map(img => img.trim());

        } else if (
            typeof image === "string" &&
            image.trim() !== ""
        ) {

            product.images = [
                image.trim()
            ];

        }


        // =====================================
        // APPROVED → PENDING
        // =====================================

        if (product.status === "approved") {

            product.status = "pending";

            product.rejectionReason = null;

        }


        await product.save();


        res.status(200).json({

            success: true,

            message:
                "Product updated and sent for admin approval",

            product

        });

    } catch (error) {

        console.log(
            "UPDATE PRODUCT ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================
// SELLER → DELETE PRODUCT
// =====================================

const deleteProduct = async (req, res) => {

    try {

        const { productId } = req.params;


        const product =
            await Product.findById(productId);


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }


        // =====================================
        // OWNERSHIP
        // =====================================

        if (
            product.seller.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to delete this product"

            });

        }


        await Product.findByIdAndDelete(
            productId
        );


        res.status(200).json({

            success: true,

            message:
                "Product deleted successfully"

        });

    } catch (error) {

        console.log(
            "DELETE PRODUCT ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================
// EXPORTS
// =====================================

module.exports = {

    getSellerDashboard,

    createProduct,

    getProducts,

    getSellerProducts,

    updateProduct,

    deleteProduct

};