const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        quantity: {
            type: Number,
            default: 1
        },

        amount: {
            type: Number,
            required: true
        },

        reason: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
                "refunded"
            ],
            default: "pending"
        },

        rejectionReason: {
            type: String,
            default: null
        },

        refundStatus: {
            type: String,
            enum: [
                "not_started",
                "processing",
                "completed"
            ],
            default: "not_started"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Return", returnSchema);