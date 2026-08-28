
const Product = require("../models/Product");

// =====================================
// SELLER → CREATE PRODUCT
// =====================================

const createProduct = async (req, res) => {
    try {

        const {
            name,
            description,
            image,
            images,
            price,
            category,
            stock
        } = req.body;

        // Required fields
        if (
            !name ||
            !description ||
            price === undefined ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, description, price and category are required"
            });
        }

        // Image handle
        let productImages = [];

        if (image && image.trim() !== "") {
            productImages.push(image.trim());
        }

        if (Array.isArray(images)) {
            productImages = images.filter(
                (img) => typeof img === "string" && img.trim() !== ""
            );
        }

        const product = await Product.create({

            name: name.trim(),

            description: description.trim(),

            price: Number(price),

            images: productImages,

            category,

            stock: Number(stock) || 0,

            seller: req.user._id,

            status: "pending"

        });

        res.status(201).json({

            success: true,

            message: "Product created and sent for approval",

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
            image,
            images
        } = req.body;

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }

        // Seller ownership
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

        // Update fields
        if (name !== undefined) {
            product.name = name;
        }

        if (description !== undefined) {
            product.description = description;
        }

        if (price !== undefined) {
            product.price = Number(price);
        }

        if (category !== undefined) {
            product.category = category;
        }

        if (stock !== undefined) {
            product.stock = Number(stock);
        }

        // Image update
        if (image !== undefined && image.trim() !== "") {

            product.images = [image.trim()];

        }

        if (Array.isArray(images)) {

            product.images = images.filter(
                (img) =>
                    typeof img === "string" &&
                    img.trim() !== ""
            );

        }

        // Approved product edit
        // → Admin approval required again

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

        // Seller ownership
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

        await Product.findByIdAndDelete(productId);

        res.status(200).json({

            success: true,

            message: "Product deleted successfully"

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


module.exports = {

    createProduct,

    getProducts,

    getSellerProducts,

    updateProduct,

    deleteProduct

};

