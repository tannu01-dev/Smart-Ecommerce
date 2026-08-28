const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// =====================================
// CREATE RAZORPAY ORDER
// =====================================

const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required"
            });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        res.status(200).json({
            success: true,
            order: razorpayOrder
        });

    } catch (error) {
        console.log("RAZORPAY CREATE ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// VERIFY PAYMENT + CREATE ORDER
// =====================================

const verifyPayment = async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,

            // Order details frontend se aayengi
            items,
            totalAmount,
            shippingAddress
        } = req.body;


        // =====================================
        // 1. REQUIRED DATA CHECK
        // =====================================

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !items ||
            items.length === 0 ||
            !totalAmount ||
            !shippingAddress
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment and order details are required"
            });
        }


        // =====================================
        // 2. VERIFY RAZORPAY SIGNATURE
        // =====================================

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");


        if (generatedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });

        }


        // =====================================
        // 3. PREVENT DUPLICATE ORDER
        // =====================================

        const existingOrder = await Order.findOne({
            razorpayOrderId: razorpay_order_id
        });

        if (existingOrder) {

            return res.status(200).json({
                success: true,
                message: "Order already created",
                order: existingOrder
            });

        }


        // =====================================
        // 4. GET PRODUCTS FROM DATABASE
        // =====================================

        const finalItems = [];

        for (const item of items) {

            const product = await Product.findById(
                item.product
            );

            if (!product) {

                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });

            }


            // Only approved products
            if (product.status !== "approved") {

                return res.status(400).json({
                    success: false,
                    message: `${product.name} is not available`
                });

            }


            // Stock check
            if (product.stock < item.quantity) {

                return res.status(400).json({
                    success: false,
                    message: `${product.name} is out of stock`
                });

            }


            finalItems.push({

                product: product._id,

                // IMPORTANT:
                // Seller database se aa raha hai
                seller: product.seller,

                name: product.name,

                price: product.price,

                quantity: item.quantity

            });
        }


        // =====================================
        // 5. CREATE ORDER AFTER PAYMENT
        // =====================================

        const order = await Order.create({

            user: req.user._id,

            items: finalItems,

            totalAmount,

            shippingAddress,

            paymentMethod: "ONLINE",

            paymentStatus: "paid",

            // Seller ko yahin se pending order milega
            orderStatus: "pending",

            razorpayOrderId: razorpay_order_id,

            razorpayPaymentId: razorpay_payment_id

        });


        // =====================================
        // 6. RESPONSE
        // =====================================

        res.status(201).json({

            success: true,

            message: "Payment verified and order created successfully",

            order

        });


    } catch (error) {

        console.log(
            "PAYMENT VERIFY + ORDER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    createRazorpayOrder,
    verifyPayment
};