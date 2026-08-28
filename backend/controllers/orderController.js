
const Order = require("../models/Order");
const Product = require("../models/Product");

// ===============================
// USER → CREATE ORDER
// ===============================
const createOrder = async (req, res) => {
    try {
        const {
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        } = req.body;

        if (
            !items ||
            items.length === 0 ||
            !totalAmount ||
            !shippingAddress ||
            !paymentMethod
        ) {
            return res.status(400).json({
                success: false,
                message: "All order details are required"
            });
        }

        const finalItems = [];

        for (const item of items) {

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }

            if (product.status !== "approved") {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} is not available`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} is out of stock`
                });
            }

            finalItems.push({
                product: product._id,
                seller: product.seller,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        const order = await Order.create({
            user: req.user._id,

            items: finalItems,

            totalAmount: Number(totalAmount),

            shippingAddress,

            paymentMethod,

            paymentStatus:
                paymentMethod === "ONLINE"
                    ? "paid"
                    : "pending",

            orderStatus: "pending"
        });

        // Reduce stock after order creation
        for (const item of finalItems) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });

    } catch (error) {

        console.log("CREATE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// USER → MY ORDERS
// ===============================
const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user._id
        })
            .populate("user", "name email")
            .populate("items.product", "name price images")
            .populate("items.seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.log("MY ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// ADMIN → ALL ORDERS
// ===============================
const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name price images")
            .populate("items.seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.log("ADMIN ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// SELLER → GET SELLER ORDERS
// ===============================
const getSellerOrders = async (req, res) => {
    try {

        const sellerId = req.user._id;

        console.log(
            "LOGGED SELLER ID:",
            sellerId.toString()
        );

        const orders = await Order.find({
            "items.seller": sellerId
        })
            .populate("user", "name email")
            .populate(
                "items.product",
                "name price images"
            )
            .populate(
                "items.seller",
                "name email"
            )
            .sort({ createdAt: -1 });

        console.log(
            "SELLER ORDERS COUNT:",
            orders.length
        );

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.log(
            "SELLER ORDERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// SELLER → UPDATE ORDER STATUS
// ===============================
const updateOrderStatus = async (req, res) => {
    try {

        // IMPORTANT
        // Route me :orderId hai
        const { orderId } = req.params;

        const { status } = req.body;

        console.log(
            "UPDATE ORDER ID:",
            orderId
        );

        console.log(
            "NEW STATUS:",
            status
        );

        console.log(
            "SELLER ID:",
            req.user._id.toString()
        );


        // ===============================
        // CHECK STATUS
        // ===============================

        const allowedStatuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled",
            "returned"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }


        // ===============================
        // FIND ORDER
        // ===============================

        const order = await Order.findById(orderId);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }


        // ===============================
        // CHECK SELLER
        // ===============================

        const isSeller = order.items.some(
            item =>
                item.seller &&
                item.seller.toString() ===
                req.user._id.toString()
        );

        if (!isSeller) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to update this order"
            });
        }


        // ===============================
        // STATUS FLOW
        // ===============================

        const currentStatus = order.orderStatus;

        const validTransitions = {
            pending: ["confirmed", "cancelled"],

            confirmed: ["processing", "cancelled"],

            processing: ["shipped"],

            shipped: ["out_for_delivery"],

            out_for_delivery: ["delivered"],

            delivered: [],

            cancelled: [],

            returned: []
        };


        if (
            currentStatus !== status &&
            !validTransitions[currentStatus]?.includes(status)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Cannot change order status from ${currentStatus} to ${status}`
            });
        }


        // ===============================
        // UPDATE STATUS
        // ===============================

        order.orderStatus = status;

        await order.save();


        // ===============================
        // RESPONSE
        // ===============================

        res.status(200).json({
            success: true,
            message:
                "Order status updated successfully",
            order
        });

    } catch (error) {

        console.log(
            "UPDATE ORDER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// EXPORTS
// ===============================
module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getSellerOrders,
    updateOrderStatus
};

