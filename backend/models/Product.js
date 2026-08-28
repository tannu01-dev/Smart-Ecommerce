const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        images: [
            {
                type: String
            }
        ],
        category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
},

       
      

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        rejectionReason: {
            type: String,
            default: null
        },

        averageRating: {
            type: Number,
            default: 0
        },

        totalReviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;