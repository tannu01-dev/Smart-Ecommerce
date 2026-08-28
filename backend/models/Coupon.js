const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0
        },

        minimumOrderAmount: {
            type: Number,
            default: 0
        },

        maximumDiscount: {
            type: Number,
            default: null
        },

        usageLimit: {
            type: Number,
            default: null
        },

        usedCount: {
            type: Number,
            default: 0
        },

        startDate: {
            type: Date,
            required: true
        },

        expiryDate: {
            type: Date,
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Coupon", couponSchema);