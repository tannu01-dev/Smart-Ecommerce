const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                seller: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                name: {
                    type: String,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        shippingAddress: {
            name: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            },

            pincode: {
                type: String,
                required: true
            }
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            default: "COD"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "out_for_delivery",
                "delivered",
                "cancelled",
                "returned"
            ],
            default: "pending"
        },
        razorpayOrderId: {
    type: String,
    default: null
},

razorpayPaymentId: {
    type: String,
    default: null
},

        cancelReason: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;